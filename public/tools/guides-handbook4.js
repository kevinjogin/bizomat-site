// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook4).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "circular-segment": {
    "purpose": "Solve a circular segment from its radius and height, or find the radius of an arc from a measured chord and height.",
    "uses": [
      "Find the radius of a curved part from a chord and height measurement",
      "Lay out arcs, flats and partial bores",
      "Estimate area of a segment-shaped plate or liquid section"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "mode": "Choose what you have measured or know from the drawing.",
      "radius": "Drawing radius (used only with radius and height).",
      "chord": "Straight distance between the arc ends, measured or from the drawing (used only with chord and height).",
      "height": "Distance from the chord midpoint to the arc, at right angles to the chord."
    },
    "outputs": [
      "Radius",
      "Chord length",
      "Included angle",
      "Arc length",
      "Segment area"
    ],
    "method": [
      "From chord c and height h: radius r = (c²/4 + h²) ÷ (2h).",
      "Included angle θ = 2 × arccos((r − h) ÷ r); chord = 2√(h(2r − h)); arc = r × θ (θ in radians).",
      "Segment area = r²(θ − sin θ) ÷ 2.",
      "Example: radius 50 mm and height 20 mm give a chord of 80 mm, an included angle of 106.26°, an arc of 92.73 mm and an area of 1,118.2 mm²."
    ],
    "limitations": [
      "Assumes a true circular arc; a measured profile with form error gives an averaged radius.",
      "A small height relative to the chord makes the calculated radius very sensitive to the height measurement.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the sensitivity table: when the height is small, a few micrometres change the radius considerably."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 77–80. Topic reference; no source tables or recommended settings are reproduced.",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–76. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "regular-polygon": {
    "purpose": "Convert between side length, across-flats and across-corners sizes of a regular polygon such as a hexagon or square, with area and angles.",
    "uses": [
      "Find the bar size that will yield a hexagon or square across flats",
      "Check spanner flats and corner clearance",
      "Lay out polygon pockets"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "sides": "6 for a hexagon, 4 for a square, 8 for an octagon.",
      "basis": "Which dimension the drawing or standard specifies.",
      "size": "The specified dimension in millimetres."
    },
    "outputs": [
      "Across flats",
      "Across corners",
      "Side length",
      "Area",
      "Interior angle",
      "Perimeter"
    ],
    "method": [
      "Across flats F = s ÷ tan(π/n); across corners C = s ÷ sin(π/n), where s is the side and n the number of sides.",
      "Area = n × s² ÷ (4 tan(π/n)); interior angle = 180° × (n − 2) ÷ n.",
      "Example: a hexagon 24 mm across flats is 27.713 mm across corners with 13.856 mm sides and an area of 498.83 mm²."
    ],
    "limitations": [
      "Sharp corners are assumed; chamfered or rounded corners reduce the across-corners size and area.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Round bar stock must be at least the across-corners size to machine a full polygon."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 76, 81–82. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "triangle-solver": {
    "purpose": "Solve any triangle from three sides, two sides and the included angle, or two angles and the included side, using the laws of sines and cosines.",
    "uses": [
      "Find hole positions and distances on brackets and frames",
      "Check angles of gussets and braces",
      "Solve layout problems without CAD"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "mode": "Choose the combination you know.",
      "a": "Side opposite angle A.",
      "b": "Side opposite angle B.",
      "c": "Side opposite angle C.",
      "A": "Interior angle opposite side a (used with two angles and the included side).",
      "B": "Interior angle opposite side b (used with two angles and the included side).",
      "C": "Interior angle opposite side c (used with two sides and the included angle)."
    },
    "outputs": [
      "All three sides",
      "All three angles",
      "Area",
      "Perimeter",
      "Circumscribed and inscribed circle radii"
    ],
    "method": [
      "Three sides: A = arccos((b² + c² − a²) ÷ 2bc), and similarly for B; C = 180° − A − B.",
      "Two sides and angle C: c = √(a² + b² − 2ab cos C), then the remaining angles by the law of cosines.",
      "Two angles and side c: C = 180° − A − B; a = c sin A ÷ sin C; b = c sin B ÷ sin C.",
      "Area = ½ab sin C; circumradius R = a ÷ (2 sin A); inradius r = area ÷ semi-perimeter.",
      "Example: sides 30, 40 and 50 mm give angles of 36.87°, 53.13° and 90° and an area of 600 mm²."
    ],
    "limitations": [
      "Two sides with a non-included angle (the ambiguous case) is not offered; convert it to one of the listed cases.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the inradius and circumradius to check fit of round features in triangular spaces."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–102. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "tank-volume": {
    "purpose": "Volume of liquid in a horizontal or vertical cylindrical tank at a given depth, with percentage full and remaining capacity.",
    "uses": [
      "Build a dip chart for a horizontal tank",
      "Estimate coolant, oil or fuel stock from a depth reading",
      "Check tank capacity for a batch"
    ],
    "users": [
      "Maintenance planners",
      "Process engineers",
      "Operators"
    ],
    "inputs": {
      "orient": "How the tank axis is installed.",
      "diameter": "Inside diameter from the tank drawing or measured shell circumference ÷ π minus wall thickness.",
      "length": "Straight shell length between flat ends (horizontal) or shell height (vertical).",
      "depth": "Measured liquid depth from the lowest inside point."
    },
    "outputs": [
      "Liquid volume",
      "Percentage full",
      "Full capacity",
      "Remaining capacity"
    ],
    "method": [
      "Horizontal: wetted area = r² arccos((r − h) ÷ r) − (r − h)√(2rh − h²); volume = area × length.",
      "Vertical: volume = π r² × depth.",
      "Volumes are converted from mm³ to litres (÷ 10⁶).",
      "Example: a horizontal tank 1200 mm × 3000 mm at 400 mm depth holds 990.02 L, 29.179% of its 3,392.9 L capacity."
    ],
    "limitations": [
      "Flat ends only; dished or hemispherical heads add volume not included here.",
      "The tank is assumed level; a slope changes the depth–volume relation.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Calibrate against a measured fill where stock value matters."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 68–69. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "frustum-volume": {
    "purpose": "Volume and slant surface area of a round (cone frustum) or rectangular (pyramid frustum) hopper, transition or bin.",
    "uses": [
      "Size hoppers and chutes",
      "Estimate sheet area for a fabricated transition",
      "Check bin capacity"
    ],
    "users": [
      "Fabrication estimators",
      "Design engineers"
    ],
    "inputs": {
      "shape": "Round for cones, rectangular for pyramid-shaped hoppers.",
      "top1": "Inside diameter (round) or length (rectangular) at the top.",
      "top2": "Inside width at the top; ignored for round.",
      "bot1": "Inside diameter or length at the outlet; 0 for a full cone or pyramid.",
      "bot2": "Inside width at the outlet; ignored for round.",
      "height": "Vertical distance between the top and bottom planes."
    },
    "outputs": [
      "Volume",
      "Slant surface area",
      "Slant height and side angle"
    ],
    "method": [
      "Round: V = πh(D² + Dd + d²) ÷ 12; side area = π(R + r) × √((R − r)² + h²).",
      "Rectangular: V = h(A₁ + A₂ + 4Aₘ) ÷ 6 (prismoidal formula, exact for a frustum), with Aₘ the mid-height section.",
      "Rectangular side area = sum of four trapezoids with slant heights √(h² + ((top − bottom) ÷ 2)²).",
      "Example: a round hopper 1000 mm to 300 mm over 900 mm holds 327.51 L with 1.9719 m² of side area."
    ],
    "limitations": [
      "Centred (symmetrical) frustum assumed; offset outlets change the side area.",
      "Plate thickness, laps and seams are not included in the area.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the side angle against the material flow requirement for the stored product."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 82–87, 66. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "ellipse": {
    "purpose": "Area, perimeter (Ramanujan’s second approximation) and eccentricity of an ellipse from its two axes.",
    "uses": [
      "Estimate gasket or seal length for elliptical manways",
      "Area of elliptical openings and cut-outs",
      "Lay out elliptical heads"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "major": "Longest overall dimension from the drawing.",
      "minor": "Shortest overall dimension, at right angles to the major axis."
    },
    "outputs": [
      "Area",
      "Perimeter",
      "Eccentricity",
      "Focal distance from centre"
    ],
    "method": [
      "With semi-axes a and b: area = πab.",
      "Perimeter ≈ π(a + b)(1 + 3λ ÷ (10 + √(4 − 3λ))), λ = ((a − b) ÷ (a + b))².",
      "Eccentricity e = √(1 − b² ÷ a²); focal distance = a × e.",
      "Example: 400 × 300 mm gives an area of 94,248 mm² and a perimeter of 1,105.2 mm."
    ],
    "limitations": [
      "The perimeter formula is an approximation; its error is negligible for engineering ellipses.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Add seam allowance or overlap when cutting seals or strips to the perimeter."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 48–50, 70–75. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "compound-angle": {
    "purpose": "Combine two angles measured in perpendicular planes into the true compound angle and its direction, for compound sine plates, fixtures and hoppers.",
    "uses": [
      "Set work on a compound sine plate",
      "Find the true slope of a surface tilted in two directions",
      "Check hopper and chute valley angles"
    ],
    "users": [
      "Toolmakers",
      "Machinists",
      "Design engineers"
    ],
    "inputs": {
      "angleA": "Slope of the surface measured in the first vertical plane (e.g. seen from the front).",
      "angleB": "Slope of the same surface measured in the perpendicular vertical plane (e.g. seen from the side)."
    },
    "outputs": [
      "True compound angle",
      "Direction of steepest slope",
      "Equivalent single-plane setting"
    ],
    "method": [
      "tan C = √(tan²A + tan²B), where A and B are the slopes seen in two perpendicular planes.",
      "Direction of the steepest slope from the first plane: tan R = tan B ÷ tan A.",
      "Example: slopes of 20° and 30° combine to a true angle of 34.314°, 57.772° from the first plane."
    ],
    "limitations": [
      "Both angles must be apparent slopes of one plane surface, measured in vertical planes at right angles.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Set a single-axis sine plate to the compound angle after rotating the part by the direction angle."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 119–121. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "polar-coordinates": {
    "purpose": "Convert a point between polar (radius and angle) and rectangular (X and Y) coordinates about a chosen origin, for hole positions and CNC programming.",
    "uses": [
      "Program a hole at a radius and angle",
      "Check a measured XY position against a polar callout",
      "Convert inspection data"
    ],
    "users": [
      "CNC programmers",
      "Quality inspectors",
      "Toolmakers"
    ],
    "inputs": {
      "mode": "Direction of conversion.",
      "radius": "Distance from the origin (used for radius and angle → X and Y).",
      "angle": "Angle measured anticlockwise from the positive X axis; negative is clockwise.",
      "x": "X coordinate from the origin (used for X and Y → radius and angle).",
      "y": "Y coordinate from the origin."
    },
    "outputs": [
      "X and Y",
      "Radius",
      "Angle (0–360°)"
    ],
    "method": [
      "X = r cos θ; Y = r sin θ.",
      "r = √(X² + Y²); θ = atan2(Y, X), reported from 0° to 360°.",
      "Example: a radius of 50 mm at 30° is X = 43.301 mm, Y = 25 mm."
    ],
    "limitations": [
      "Angles follow the mathematical convention (anticlockwise from +X); some machine controls and drawings measure differently.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Confirm the angle zero and direction against the drawing before programming."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 43–45, 692–694. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dovetail-measurement": {
    "purpose": "Measurement over rods for a male dovetail or between rods for a female dovetail slide, with a check that the rods touch the flanks below the edge.",
    "uses": [
      "Machine and inspect dovetail slides and gibs",
      "Write an inspection dimension for a drawing",
      "Choose a suitable rod size"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "type": "Male for the tongue, female for the slot.",
      "angle": "Angle between flank and base from the drawing; 60° and 55° are common.",
      "width": "Male: width across the base corners (narrowest). Female: width across the bottom corners of the slot (widest).",
      "rod": "Measured diameter of the gauge rods or pins used.",
      "depth": "Height of the flank from the base to the edge."
    },
    "outputs": [
      "Measurement over or between rods",
      "Width at the top edge",
      "Rod contact height on the flank"
    ],
    "method": [
      "Male: x = a + D(1 + cot(α ÷ 2)). Female: y = b − D(1 + cot(α ÷ 2)), where α is the dovetail angle and D the rod diameter.",
      "Contact height on the flank = (D ÷ 2) cot(α ÷ 2) sin α; it must be below the dovetail depth.",
      "Top width = base width ± 2h cot α.",
      "Example: a 60° male dovetail 50 mm at the base with 10 mm rods measures 77.321 mm over the rods."
    ],
    "limitations": [
      "Sharp corners are assumed; corner relief or radii do not change the reading provided the rods do not touch them.",
      "Rod diameter errors enter the reading multiplied by (1 + cot(α ÷ 2)).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose a rod so that its contact point is clearly below the edge and clear of any corner relief."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "v-groove-pin": {
    "purpose": "Height of a gauge pin above (or below) the top surface of a V-groove, the depth of the sharp V and the pin contact positions.",
    "uses": [
      "Inspect V-grooves, vee blocks and seal grooves",
      "Set a dial reading for groove depth",
      "Choose a gauge pin size"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "angle": "Included angle between the two flanks from the drawing.",
      "width": "Width of the groove where the flanks meet the top surface (sharp-edge theoretical).",
      "pin": "Measured diameter of the gauge pin."
    },
    "outputs": [
      "Pin top above the surface (negative = below)",
      "Pin centre above the V apex",
      "Depth of the sharp V",
      "Contact height on the flanks"
    ],
    "method": [
      "Pin centre above the sharp V apex = (D ÷ 2) ÷ sin(β ÷ 2), where β is the included angle.",
      "Depth of the sharp V = (W ÷ 2) ÷ tan(β ÷ 2).",
      "Pin top above the surface = (D ÷ 2)(1 + 1 ÷ sin(β ÷ 2)) − depth.",
      "Example: a 90° groove 10 mm wide with a 6 mm pin: the pin top stands 2.2426 mm above the surface."
    ],
    "limitations": [
      "A rounded groove bottom does not affect the reading provided the pin touches only the flanks.",
      "Edge breaks reduce the actual width but not the theoretical sharp-edge width used here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Choose a pin whose contact points sit well inside the flanks."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 682–691. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gauge-block-stack": {
    "purpose": "Select gauge blocks from a standard 88-piece metric or 81-piece inch set to build a length, by eliminating the right-hand digit first.",
    "uses": [
      "Build a sine bar stack or comparator setting",
      "Set height gauges and calibrate instruments",
      "Check whether a length can be built from your set"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "set": "The set you own; check its inventory, because missing or worn blocks change the selection.",
      "target": "Required length, in millimetres for the metric set or inches for the inch set, to the set’s resolution (0.0005 mm or 0.0001 in)."
    },
    "outputs": [
      "Blocks to wring together",
      "Number of blocks",
      "Stack total"
    ],
    "method": [
      "Work from the right-hand digit: choose the block that clears the smallest digit, subtract it, and repeat with the next series.",
      "Metric: 1.0005 for a half-micrometre, 1.001–1.009 for micrometres, 1.01–1.49 to reach a multiple of 0.5 mm, 0.5–9.5 to reach a multiple of 10 mm, then 10–100 mm blocks.",
      "Inch: 0.1001–0.1009, then 0.101–0.149, then 0.050–0.950, then 1–4 in blocks.",
      "Example: 41.3275 mm from the 88-piece set uses 1.0005 + 1.007 + 1.32 + 8 + 30 (5 blocks)."
    ],
    "limitations": [
      "Each block is used once; the set is assumed complete.",
      "Length tolerances of the blocks and wringing films accumulate; use calibration values for high-accuracy work.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Fewer blocks give less accumulated error; wring the largest blocks first and keep the stack at reference temperature."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 705–708. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "abbe-error": {
    "purpose": "Measurement error caused by an offset between the measuring axis and the scale axis when the slide tilts (Abbe error), compared with the tolerance being checked.",
    "uses": [
      "Judge whether calipers or a height gauge are suitable for a tolerance",
      "Explain differences between instruments",
      "Plan a measurement set-up"
    ],
    "users": [
      "Quality inspectors",
      "Toolmakers",
      "Metrology technicians"
    ],
    "inputs": {
      "offset": "Perpendicular distance between the instrument scale and the line along which the feature is measured (e.g. caliper jaw depth).",
      "tilt": "Angular play or straightness error of the slide, from the instrument specification or a test.",
      "tolerance": "Total tolerance band of the feature, upper minus lower limit."
    },
    "outputs": [
      "Abbe error",
      "Error as a share of the tolerance"
    ],
    "method": [
      "Abbe error = offset × tan(tilt angle).",
      "Share of tolerance = error ÷ tolerance band × 100%.",
      "Example: a 30 mm offset with 20″ of tilt gives 2.9089 µm, 5.8178% of a 0.05 mm band."
    ],
    "limitations": [
      "Only the first-order Abbe error is calculated; other error sources (scale, temperature, force) add to it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare the share with the measurement-capability rule your organisation uses (often a fraction of the tolerance)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 709–735. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rss-tolerance-stack": {
    "purpose": "Worst-case and root-sum-square (RSS) results for a linear stack of up to five dimensions, checked against the required gap limits.",
    "uses": [
      "Check an assembly gap or clearance",
      "Decide whether statistical tolerancing is justified",
      "Find the dimension that drives the variation"
    ],
    "users": [
      "Design engineers",
      "Quality engineers"
    ],
    "inputs": {
      "dir1": "Whether dimension 1 increases or decreases the gap.",
      "nom1": "Nominal size from the drawing.",
      "tol1": "Symmetrical ± tolerance; convert unequal tolerances to a mean nominal with equal ±.",
      "dir2": "Direction of dimension 2.",
      "nom2": "Nominal of dimension 2.",
      "tol2": "Tolerance of dimension 2.",
      "dir3": "Direction of dimension 3.",
      "nom3": "Nominal of dimension 3.",
      "tol3": "Tolerance of dimension 3.",
      "dir4": "Direction of dimension 4.",
      "nom4": "Nominal of dimension 4.",
      "tol4": "Tolerance of dimension 4.",
      "dir5": "Direction of dimension 5, or not used.",
      "nom5": "Nominal of dimension 5.",
      "tol5": "Tolerance of dimension 5.",
      "reqMin": "Smallest gap the function allows, from the design requirement.",
      "reqMax": "Largest gap the function allows.",
      "inflate": "1.0 for plain RSS; a larger factor (your organisation’s rule, e.g. Bender’s 1.5) allows for shifted or non-normal processes."
    },
    "outputs": [
      "Nominal gap",
      "Worst-case limits",
      "RSS limits",
      "Largest contributor"
    ],
    "method": [
      "Nominal gap = Σ(+ nominals) − Σ(− nominals).",
      "Worst case = nominal ± Σ tolerances.",
      "RSS = nominal ± k√(Σ tolerance²), with k the inflation factor.",
      "Each dimension’s share of variance = tolerance² ÷ Σ tolerance².",
      "Example: the default stack has a nominal gap of 0.5 mm, worst case ±0.28 mm and RSS ±0.14629 mm."
    ],
    "limitations": [
      "RSS assumes independent, centred, roughly normal dimensions with tolerances at the same number of standard deviations.",
      "Linear one-dimensional stack only; angular and geometric tolerances need their own analysis.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If only the RSS result fits, the design depends on process control: confirm capability of the main contributors."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 628–634, 128–130. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "it-tolerance-grade": {
    "purpose": "Standard tolerance for ISO 286 grades IT5 to IT16 calculated from the standard tolerance unit for the size step that contains the nominal size.",
    "uses": [
      "Estimate the tolerance for a chosen IT grade",
      "Compare grades for a process capability discussion",
      "Check a fit tolerance quickly"
    ],
    "users": [
      "Design engineers",
      "Quality engineers",
      "Machinists"
    ],
    "inputs": {
      "size": "Basic size of the feature from the drawing (up to 3150 mm).",
      "grade": "The IT grade specified or being considered."
    },
    "outputs": [
      "Formula tolerance value",
      "Size step and its geometric mean",
      "Standard tolerance unit"
    ],
    "method": [
      "D = geometric mean of the ISO 286 size step containing the size (√(lower × upper); the first step uses 1 and 3 mm).",
      "Up to 500 mm: i = 0.45∛D + 0.001D µm. Above 500 mm: I = 0.004D + 2.1 µm.",
      "IT = k × i, with k = 7, 10, 16, 25, 40, 64, 100, 160, 250, 400, 640, 1000 for IT5 to IT16.",
      "Example: 25 mm in IT7 lies in the 18–30 mm step; the formula gives 20.918 µm."
    ],
    "limitations": [
      "ISO 286-1 tabulates rounded values; use the table value on drawings. The formula value can differ by about 1 µm or by rounding steps for coarse grades.",
      "Grades finer than IT5 use different formulas and are not covered.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the result to compare grades; take limits for specific fits (e.g. H7/g6) from ISO 286-2."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 635–668. Topic reference; no source tables or recommended settings are reproduced.",
      "ISO 286-1:2010 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes — https://www.iso.org/standard/45975.html"
    ]
  },
  "length-converter": {
    "purpose": "Convert a length between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert length values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The length in each listed unit",
      "Value in m"
    ],
    "method": [
      "Value in m = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … m): mm 0.001; µm 0.000001; cm 0.01; km 1000; in 0.0254; thou (mil) 0.0000254; ft 0.3048; yd 0.9144; mile 1609.344.",
      "Example: 1 in = 0.0254 m."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2661–2662. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "force-converter": {
    "purpose": "Convert a force between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert force values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The force in each listed unit",
      "Value in N"
    ],
    "method": [
      "Value in N = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … N): kN 1000; MN 1000000; kgf 9.80665; tonne-force 9806.65; lbf 4.4482216152605; kip (1000 lbf) 4448.2216152605; ozf 0.27801385095378; dyne 0.00001.",
      "Example: 1000 lbf = 4,448.2216 N."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2683–2686. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "pressure-converter": {
    "purpose": "Convert a pressure or stress between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert pressure or stress values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The pressure or stress in each listed unit",
      "Value in Pa"
    ],
    "method": [
      "Value in Pa = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … Pa): kPa 1000; MPa (N/mm²) 1000000; GPa 1000000000; bar 100000; mbar 100; psi 6894.7572931684; ksi 6894757.2931684; standard atmosphere 101325; kgf/cm² 98066.5; mmHg 133.322387415; inHg (32 °F) 3386.388640341; inH₂O (4 °C) 249.08891.",
      "Example: 100 psi = 689,475.73 Pa."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Gauge and absolute pressures differ by atmospheric pressure; this converter does not change the reference.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2686–2694. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "torque-converter": {
    "purpose": "Convert a torque between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert torque values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The torque in each listed unit",
      "Value in N·m"
    ],
    "method": [
      "Value in N·m = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … N·m): N·mm 0.001; kN·m 1000; kgf·m 9.80665; kgf·cm 0.0980665; lbf·ft 1.3558179483314; lbf·in 0.1129848290276; ozf·in 0.0070615518142.",
      "Example: 50 lbf·ft = 67.790897 N·m."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2686–2694. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "power-converter": {
    "purpose": "Convert a power between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert power values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The power in each listed unit",
      "Value in W"
    ],
    "method": [
      "Value in W = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … W): kW 1000; MW 1000000; hp (mechanical) 745.69987158227; metric horsepower (PS) 735.49875; ft·lbf/s 1.3558179483314; BTU/h (IT) 0.29307107017222; kcal/h (IT) 1.163; ton of refrigeration 3516.8528420667.",
      "Example: 10 hp (mechanical) = 7,456.9987 W."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2695–2697. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "energy-converter": {
    "purpose": "Convert a energy between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert energy values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The energy in each listed unit",
      "Value in J"
    ],
    "method": [
      "Value in J = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … J): kJ 1000; MJ 1000000; Wh 3600; kWh 3600000; cal (IT) 4.1868; kcal (IT) 4186.8; BTU (IT) 1055.05585262; ft·lbf 1.3558179483314; therm (EC) 105506000.",
      "Example: 1 kWh = 3,600,000 J."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2695–2697. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "flow-converter": {
    "purpose": "Convert a volumetric flow rate between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert volumetric flow rate values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The volumetric flow rate in each listed unit",
      "Value in m³/s"
    ],
    "method": [
      "Value in m³/s = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … m³/s): m³/h 0.0002777777777777778; m³/min 0.016666666666666666; L/s 0.001; L/min 0.000016666666666666667; US gal/min 0.0000630901964; UK gal/min 0.00007576816666666667; ft³/min (cfm) 0.0004719474432; ft³/s 0.028316846592.",
      "Example: 100 L/min = 0.00166667 m³/s."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "For compressed air and gases, flow depends on the reference pressure and temperature (free air, normal or standard); keep the same reference on both sides.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2682. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "mass-converter": {
    "purpose": "Convert a mass between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert mass values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The mass in each listed unit",
      "Value in kg"
    ],
    "method": [
      "Value in kg = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … kg): g 0.001; tonne 1000; lb 0.45359237; oz (avoirdupois) 0.028349523125; short ton (2000 lb) 907.18474; long ton (2240 lb) 1016.0469088; slug 14.593902937206.",
      "Example: 100 lb = 45.359237 kg."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2683–2685. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "velocity-converter": {
    "purpose": "Convert a speed between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert speed values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The speed in each listed unit",
      "Value in m/s"
    ],
    "method": [
      "Value in m/s = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … m/s): m/min 0.016666666666666666; mm/min 0.000016666666666666667; km/h 0.2777777777777778; ft/s 0.3048; ft/min (sfm) 0.00508; in/min (ipm) 0.00042333333333333334; mile/h 0.44704; knot 0.5144444444444445.",
      "Example: 400 ft/min (sfm) = 2.032 m/s."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2698. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "angle-converter": {
    "purpose": "Convert a angle between SI, metric and US customary units and see it in every listed unit at once.",
    "uses": [
      "Convert angle values on drawings, data sheets and quotes",
      "Check supplier data given in other units"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The number exactly as written on the drawing, data sheet or quote.",
      "from": "The unit printed beside the value; check prefixes such as k, M and m."
    },
    "outputs": [
      "The angle in each listed unit",
      "Value in degree"
    ],
    "method": [
      "Value in degree = entered value × factor of the entered unit.",
      "Value in each other unit = SI value ÷ that unit’s factor.",
      "Factors used (1 unit = … degree): radian 57.29577951308232; gradian 0.9; arc-minute 0.016666666666666666; arc-second 0.0002777777777777778; milliradian 0.05729577951308232; revolution 360.",
      "Example: 1 radian = 57.29578 degree."
    ],
    "limitations": [
      "Displayed values are rounded to eight decimal places; small values use significant figures.",
      "Degrees–minutes–seconds can be read from the arc-minute and arc-second rows.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the unit your specification is written in, and keep the original value on record."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 103–104, 2662. Topic reference; no source tables or recommended settings are reproduced.",
      "BIPM: The International System of Units (SI brochure) — https://www.bipm.org/en/publications/si-brochure"
    ]
  },
  "temperature-converter": {
    "purpose": "Convert a temperature or a temperature difference between Celsius, Fahrenheit, kelvin and Rankine.",
    "uses": [
      "Convert heat-treatment and process temperatures",
      "Convert a temperature rise for thermal expansion calculations"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "kind": "A reading such as 150 °C, or a change such as a 50 °C rise; differences convert without the offset.",
      "value": "The number as written.",
      "from": "The scale of the entered value."
    },
    "outputs": [
      "Value in °C, °F, K and °R"
    ],
    "method": [
      "Readings: K = °C + 273.15; °F = °C × 9/5 + 32; °R = K × 9/5.",
      "Differences: 1 °C = 1 K = 1.8 °F = 1.8 °R (no offset).",
      "Example: 100 °C is 212 °F and 373.15 K."
    ],
    "limitations": [
      "Readings below absolute zero are rejected.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the difference mode for expansion and heating calculations."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2695–2696. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "decimal-fraction": {
    "purpose": "Nearest fractional-inch size (to 1/8 … 1/128), the best fraction with a limited denominator (continued fractions) and the millimetre equivalent.",
    "uses": [
      "Find the nearest fractional drill or stock size",
      "Approximate a ratio with small whole numbers for change gears",
      "Convert inch decimals to millimetres"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Design engineers"
    ],
    "inputs": {
      "value": "The decimal number, in inches for size work or a plain ratio.",
      "denom": "The smallest fraction step you can use, e.g. 1/64 for fractional drills.",
      "maxDen": "Largest denominator allowed for the best-fraction approximation, e.g. the largest gear tooth count."
    },
    "outputs": [
      "Nearest fraction at the chosen resolution and its error",
      "Best fraction with a limited denominator and its error",
      "Millimetre equivalent"
    ],
    "method": [
      "Nearest fraction = round(value × N) ÷ N, reduced to lowest terms.",
      "Best fraction: continued-fraction convergents and semiconvergents of the value, keeping the closest with denominator ≤ the limit.",
      "Millimetres = inches × 25.4.",
      "Example: 0.4375 is exactly 7/16 in (11.1125 mm)."
    ],
    "limitations": [
      "Negative values are not accepted; convert the magnitude.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For ratios, check the error against the accuracy the job needs (e.g. thread pitch error over the thread length)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3, 11–13. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
