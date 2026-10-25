// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook14).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "plane-area": {
    "purpose": "Area, perimeter and equivalent circle and square of common plane figures: circle, ring, sector, ring sector, rectangle, parallelogram, trapezoid, fillet (spandrel), parabolic segment and cycloid.",
    "uses": [
      "Find plate, gasket and section areas",
      "Estimate material for cut shapes",
      "Check areas on drawings"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "shape": "The figure; the option text says which dimension each input means.",
      "A": "Main dimension as described for the shape.",
      "B": "Second dimension where the shape needs it.",
      "C": "Height where the shape needs it.",
      "angle": "Included angle of a sector or ring sector."
    },
    "outputs": [
      "Area",
      "Perimeter (where defined)",
      "Diameter of a circle and side of a square with the same area"
    ],
    "method": [
      "Circle πd²/4; ring π(D² − d²)/4; sector πr²θ/360; ring sector π(R² − r²)θ/360; rectangle AB; parallelogram base × height; trapezoid (a + b)h/2.",
      "Fillet (spandrel) between a quarter circle and its tangents: r²(1 − π/4) = 0.2146 r².",
      "Parabolic segment 2/3 × chord × height; cycloid 3πr² with arc length 8r.",
      "Equal-area circle diameter = √(4A/π); equal-area square side = √A.",
      "Example: a trapezoid with parallel sides 100 and 60 mm and height 40 mm has an area of 3,200 mm²."
    ],
    "limitations": [
      "Ideal geometric figures; fillets and corner radii on real parts change the area.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the polygon area tool for irregular shapes defined by corner coordinates."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–81. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "polygon-area": {
    "purpose": "Area (shoelace formula), perimeter and centroid of any simple polygon with up to eight corners, including irregular quadrilaterals (trapeziums) and plate outlines.",
    "uses": [
      "Find the area and centroid of a plate or gusset",
      "Calculate the area of an irregular quadrilateral",
      "Check CAD areas"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "n": "How many of the listed corners are used (the first n), in order around the outline.",
      "x1": "X coordinate of corner 1.",
      "y1": "Y coordinate of corner 1.",
      "x2": "X coordinate of corner 2.",
      "y2": "Y coordinate of corner 2.",
      "x3": "X coordinate of corner 3.",
      "y3": "Y coordinate of corner 3.",
      "x4": "X coordinate of corner 4.",
      "y4": "Y coordinate of corner 4.",
      "x5": "X coordinate of corner 5.",
      "y5": "Y coordinate of corner 5.",
      "x6": "X coordinate of corner 6.",
      "y6": "Y coordinate of corner 6.",
      "x7": "X coordinate of corner 7.",
      "y7": "Y coordinate of corner 7.",
      "x8": "X coordinate of corner 8.",
      "y8": "Y coordinate of corner 8."
    },
    "outputs": [
      "Area",
      "Perimeter",
      "Centroid",
      "Direction of the corner order"
    ],
    "method": [
      "Area = ½ |Σ (xᵢ yᵢ₊₁ − xᵢ₊₁ yᵢ)| (shoelace formula).",
      "Centroid x̄ = Σ (xᵢ + xᵢ₊₁)(xᵢ yᵢ₊₁ − xᵢ₊₁ yᵢ) ÷ 6A, and similarly for ȳ (signed A).",
      "Perimeter = sum of side lengths.",
      "Example: the default quadrilateral has an area of 6,350 mm² with its centroid at (60.919, 28.976)."
    ],
    "limitations": [
      "Simple polygons only: sides must not cross each other.",
      "Straight sides; arcs need their own segment areas added or subtracted.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "List corners consecutively around the outline, either direction."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–48, 66–76. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "solid-volume": {
    "purpose": "Volume, surface area and mass of spheres, hollow spheres, spherical caps, zones, sectors and wedges, cones, pyramids, cylinders, cylindrical hoofs, paraboloids, barrels, tori and ellipsoids.",
    "uses": [
      "Find volumes and masses of turned and formed parts",
      "Estimate tank and vessel capacities",
      "Check CAD volumes"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "shape": "Solid type; the option text names each dimension.",
      "A": "First dimension as described.",
      "B": "Second dimension where needed.",
      "C": "Height or length where needed.",
      "angle": "Included angle of a spherical wedge.",
      "rho": "Material density to give a mass (0 to skip)."
    },
    "outputs": [
      "Volume",
      "Surface area (where a simple formula exists)",
      "Mass"
    ],
    "method": [
      "Sphere πd³/6; cap πh(3a² + h²)/6; zone πh(3a² + 3b² + h²)/6; sector 2πr²h/3; wedge (θ/360) × 4πr³/3.",
      "Cone and pyramid ⅓ × base × height; hoof 2r²h/3; paraboloid πr²h/2; paraboloidal segment πh(R² + r²)/2.",
      "Barrel with parabolic staves πL(8D² + 4Dd + 3d²) ÷ 60 (D at the bung, d at the heads); torus 2π²Rr²; ellipsoid πabc ÷ 6 with full axes.",
      "Example: a spherical cap of 100 mm base radius and 30 mm height holds 485.38 cm³."
    ],
    "limitations": [
      "Ideal solids; the barrel formula assumes parabolic staves.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For hollow parts, subtract the inner volume or use the hollow shape options."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 82–88. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "centroid-shapes": {
    "purpose": "Position of the centroid (centre of gravity) of plane areas, arcs and uniform solids: triangle, sector, segment, arc, semicircle, trapezoid, parabolic area, cone, pyramid, frustum, hemisphere, hollow hemisphere, paraboloid, spherical segment and sector, and two bodies.",
    "uses": [
      "Locate lifting points and balance features",
      "Find centroids for section and moment calculations",
      "Check CAD mass properties"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "shape": "Shape; the option text names each dimension and where the result is measured from.",
      "A": "First dimension (or mass 1 for two bodies, in any consistent unit).",
      "B": "Second dimension (or mass 2).",
      "C": "Height, or distance between two bodies.",
      "angle": "Full included angle of a sector, segment or arc."
    },
    "outputs": [
      "Distance of the centre of gravity from the stated reference",
      "Area or volume of the shape"
    ],
    "method": [
      "Triangle h/3; semicircle 4r/3π; sector 2r sin(θ/2) ÷ (3 × θ/2); arc r sin(θ/2) ÷ (θ/2); segment c³ ÷ 12A from the centre.",
      "Trapezoid h(a + 2b) ÷ 3(a + b); parabolic segment 2h/5; cone and pyramid h/4; paraboloid h/3; hemisphere 3r/8; hollow hemisphere 3(R⁴ − r⁴) ÷ 8(R³ − r³).",
      "Frustum h(R² + 2Rr + 3r²) ÷ 4(R² + Rr + r²); spherical segment 3(2r − h)² ÷ 4(3r − h); spherical sector 3(2r − h)/8; two bodies m₂ d ÷ (m₁ + m₂).",
      "Example: a cone frustum 100/50 mm over 80 mm has its centre of gravity 31.429 mm above the base."
    ],
    "limitations": [
      "Uniform density and ideal shapes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Combine several shapes with the combined centre of gravity tool."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 221–227. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "complex-number": {
    "purpose": "Add, subtract, multiply and divide complex numbers and convert them between rectangular (a + bi) and polar (magnitude and angle) form, for AC circuits, vibration and phasor work.",
    "uses": [
      "Combine impedances and phasors",
      "Convert between rectangular and polar form",
      "Check vibration and control calculations"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "op": "Operation to perform.",
      "a": "Real part of the first number.",
      "b": "Imaginary part of the first number.",
      "c": "Real part of the second number.",
      "d": "Imaginary part of the second number."
    },
    "outputs": [
      "Result in rectangular form",
      "Result in polar form",
      "Polar forms of the inputs"
    ],
    "method": [
      "(a + bi)(c + di) = (ac − bd) + (ad + bc)i; (a + bi) ÷ (c + di) = [(ac + bd) + (bc − ad)i] ÷ (c² + d²).",
      "Polar: magnitude √(re² + im²), angle atan2(im, re).",
      "Example: (3 + 4i) × (1 -2i) = 11 + -2i."
    ],
    "limitations": [
      "Angles are reported in degrees from −180° to 180°.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Multiply magnitudes and add angles to check products in polar form."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 18–19. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "coordinates-3d": {
    "purpose": "Convert a point between rectangular (x, y, z), cylindrical (r, θ, z) and spherical (ρ, θ, φ) coordinates, for five-axis work, probing and layout.",
    "uses": [
      "Program points given in cylindrical or spherical form",
      "Convert probe data",
      "Lay out holes on cylinders and domes"
    ],
    "users": [
      "CNC programmers",
      "Quality inspectors",
      "Design engineers"
    ],
    "inputs": {
      "mode": "The coordinate system of the entered point.",
      "p1": "x (rectangular), r (cylindrical radius) or ρ (spherical distance from origin).",
      "p2": "y (rectangular) or θ in degrees (cylindrical and spherical), measured in the XY plane from +X.",
      "p3": "z (rectangular and cylindrical) or φ in degrees from the +Z axis (spherical)."
    },
    "outputs": [
      "Rectangular x, y, z",
      "Cylindrical r, θ, z",
      "Spherical ρ, θ, φ"
    ],
    "method": [
      "Cylindrical to rectangular: x = r cos θ, y = r sin θ, z = z.",
      "Spherical to rectangular: x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ.",
      "Back: r = √(x² + y²), ρ = √(x² + y² + z²), θ = atan2(y, x), φ = arccos(z/ρ).",
      "Example: cylindrical (50, 30°, 20) is x 43.301, y 25, z 20."
    ],
    "limitations": [
      "Mathematical convention (φ from +Z); some CAD systems measure elevation from the XY plane instead.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Check the angle conventions of your machine or software before using the values."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 43–45. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-point-distance": {
    "purpose": "Straight-line distance in 2D and 3D, the angle in the XY plane, the slope and the midpoint between two points.",
    "uses": [
      "Check hole-to-hole distances from coordinates",
      "Find the angle of a line on a drawing",
      "Compute midpoints for layout"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "x1": "X of the first point.",
      "y1": "Y of the first point.",
      "z1": "Z of the first point (0 for 2D).",
      "x2": "X of the second point.",
      "y2": "Y of the second point.",
      "z2": "Z of the second point (0 for 2D)."
    },
    "outputs": [
      "3D and plan distance",
      "Angle in the XY plane",
      "Slope and midpoint"
    ],
    "method": [
      "Distance = √(Δx² + Δy² + Δz²); plan distance = √(Δx² + Δy²).",
      "Angle = atan2(Δy, Δx) from +X; slope = Δy ÷ Δx.",
      "Midpoint = average of the coordinates.",
      "Example: (10, 20) to (70, 100) is 100 mm at 53.13°."
    ],
    "limitations": [
      "Straight-line (Euclidean) distance.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the plan distance for drawings in one plane."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–42. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "equation-solver": {
    "purpose": "Real and complex roots of a quadratic (ax² + bx + c = 0) or cubic (ax³ + bx² + cx + d = 0) equation, with the discriminant.",
    "uses": [
      "Solve design equations that reduce to a quadratic or cubic",
      "Find dimensions from area or volume relations",
      "Check hand algebra"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "degree": "Quadratic or cubic.",
      "a": "Leading coefficient (must not be zero).",
      "b": "Second coefficient.",
      "c": "Third coefficient.",
      "d": "Constant term of a cubic (ignored for a quadratic)."
    },
    "outputs": [
      "All roots (real and complex)",
      "Discriminant",
      "Number of real roots"
    ],
    "method": [
      "Quadratic: x = (−b ± √(b² − 4ac)) ÷ 2a.",
      "Cubic: reduce to t³ + pt + q = 0; three real roots by the trigonometric method when the discriminant is positive, otherwise Cardano’s formula.",
      "Each root is checked by substitution.",
      "Example: x³ − 6x² + 11x − 6 = 0 has roots 3, 2, 1."
    ],
    "limitations": [
      "Floating-point arithmetic; repeated roots may show tiny imaginary parts or differences.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Pick the physically meaningful root (for example positive and within range)."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 32–34. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "linear-system": {
    "purpose": "Solution of two or three simultaneous linear equations, with the determinant, inverse and transpose of the coefficient matrix.",
    "uses": [
      "Solve force balance and reaction equations",
      "Invert small matrices for transformations",
      "Check hand matrix calculations"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "size": "Two or three equations (the third row and column are ignored for two).",
      "a11": "Coefficient of x1 in equation 1.",
      "a12": "Coefficient of x2 in equation 1.",
      "a13": "Coefficient of x3 in equation 1.",
      "b1": "Constant on the right-hand side of equation 1.",
      "a21": "Coefficient of x1 in equation 2.",
      "a22": "Coefficient of x2 in equation 2.",
      "a23": "Coefficient of x3 in equation 2.",
      "b2": "Constant on the right-hand side of equation 2.",
      "a31": "Coefficient of x1 in equation 3.",
      "a32": "Coefficient of x2 in equation 3.",
      "a33": "Coefficient of x3 in equation 3.",
      "b3": "Constant on the right-hand side of equation 3."
    },
    "outputs": [
      "Solution x₁, x₂ (, x₃)",
      "Determinant",
      "Inverse and transpose of the matrix"
    ],
    "method": [
      "Determinant by cofactor expansion; the system has a unique solution when it is not zero.",
      "Inverse = adjugate ÷ determinant; solution x = A⁻¹ b (Cramer’s rule).",
      "Transpose swaps rows and columns.",
      "Example: the default system gives x₁ = 2, x₂ = 3, x₃ = -1."
    ],
    "limitations": [
      "Nearly singular matrices (determinant close to zero) give unreliable solutions.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Substitute the solution back into the original equations as a check."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 122–127. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "combinations": {
    "purpose": "Factorial n!, permutations nPr and combinations nCr, with large values in scientific notation, for sampling plans, tooling options and probability.",
    "uses": [
      "Count possible tool or set-up combinations",
      "Support sampling and probability calculations",
      "Check combinatorics in test plans"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "n": "Number of distinct items available (up to 170).",
      "r": "Number of items chosen."
    },
    "outputs": [
      "n!",
      "Permutations nPr (order matters)",
      "Combinations nCr (order does not matter)"
    ],
    "method": [
      "n! = 1 × 2 × … × n (0! = 1).",
      "nPr = n! ÷ (n − r)!.",
      "nCr = n! ÷ (r! (n − r)!).",
      "Example: from 10 items, 3 can be arranged in 720 ways and chosen in 120 ways."
    ],
    "limitations": [
      "Values beyond about 10¹⁵ are shown in floating point and are approximate in the last digits.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use combinations when order does not matter, permutations when it does."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 19. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "trig-functions": {
    "purpose": "Sine, cosine, tangent, cotangent, secant, cosecant, versed sine and cosine, and the involute function of an angle, or the angle whose involute is a given value (inverse involute) for gear work.",
    "uses": [
      "Replace printed trig and involute tables",
      "Find pressure angles from involute values in gear calculations",
      "Check versed sine for chord heights"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "mode": "Find functions of an angle, or the angle for an involute value.",
      "angle": "Angle in degrees.",
      "invValue": "Involute function value (inv α = tan α − α)."
    },
    "outputs": [
      "Sine, cosine, tangent, cotangent, secant, cosecant",
      "Versed sine and versed cosine",
      "Involute, or the angle from an involute"
    ],
    "method": [
      "inv α = tan α − α (α in radians).",
      "Versed sine = 1 − cos α; versed cosine = 1 − sin α.",
      "Inverse involute solved by Newton’s method.",
      "Example: inv 20° = 0.01490438."
    ],
    "limitations": [
      "The involute is defined for 0° ≤ α < 90°.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Versed sine × radius gives the height of an arc above its chord."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–114. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "dms-converter": {
    "purpose": "Convert an angle between degrees–minutes–seconds, decimal degrees and radians, for drawings, sine bar set-ups and survey data.",
    "uses": [
      "Convert drawing angles in DMS for calculations",
      "Express a calculated angle in DMS for the shop",
      "Convert to radians"
    ],
    "users": [
      "Machinists",
      "Toolmakers",
      "Engineers"
    ],
    "inputs": {
      "mode": "The form of the angle you have.",
      "d": "Whole degrees (negative for negative angles).",
      "mi": "Minutes (0–59).",
      "s": "Seconds (0–59.99).",
      "dec": "Angle in decimal degrees.",
      "r": "Angle in radians."
    },
    "outputs": [
      "Degrees–minutes–seconds",
      "Decimal degrees",
      "Radians"
    ],
    "method": [
      "Decimal = degrees + minutes ÷ 60 + seconds ÷ 3600.",
      "Minutes = fractional degrees × 60; seconds = fractional minutes × 60.",
      "Radians = degrees × π ÷ 180.",
      "Example: 12° 30′ 15″ = 12.504167°."
    ],
    "limitations": [
      "Seconds are rounded to three decimals in the display.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Sine bar and dividing head work usually needs seconds; drawings often state minutes."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 103–104. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "triangle-ssa": {
    "purpose": "Solve the ambiguous case of a triangle (two sides and an angle opposite one of them), giving none, one or two possible triangles with all sides, angles and areas.",
    "uses": [
      "Solve layout problems where only two sides and one angle are known",
      "Check whether a linkage can assemble",
      "Find both positions of a mechanism"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "a": "Side opposite the known angle.",
      "b": "The other known side.",
      "A": "Known angle, opposite side a."
    },
    "outputs": [
      "Number of solutions",
      "Angles B and C and side c for each",
      "Area of each"
    ],
    "method": [
      "sin B = b sin A ÷ a (law of sines).",
      "If sin B > 1 there is no triangle; if A is acute and a < b, B and 180° − B may both work.",
      "C = 180° − A − B; c = a sin C ÷ sin A; area = ½ ab sin C.",
      "Example: a = 40, b = 50, A = 40° gives 2 triangle(s)."
    ],
    "limitations": [
      "Plane triangles only.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Two solutions mean two possible shapes (for example two positions of a link); pick the one that matches the design."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 95–102. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "circle-packing": {
    "purpose": "Diameter of equal rollers fitting around a shaft (or the shaft for given rollers), the enclosing circle for up to ten equal circles, and the number of equal circles in a rectangle by square and hexagonal packing.",
    "uses": [
      "Design roller cages and needle-roller layouts",
      "Size a sleeve or tube for a bundle of bars",
      "Estimate parts per sheet or tubes per box"
    ],
    "users": [
      "Design engineers",
      "Toolmakers",
      "Estimators"
    ],
    "inputs": {
      "mode": "Which packing problem to solve.",
      "n": "Number of rollers around the shaft, or circles inside the circle (rectangle mode ignores it).",
      "d": "Shaft diameter (rollers around a shaft) or diameter of each small circle (other modes).",
      "W": "Rectangle width (rectangle mode).",
      "Hh": "Rectangle height (rectangle mode)."
    },
    "outputs": [
      "Roller diameter and ring outside diameter",
      "Enclosing circle diameter",
      "Circles per rectangle by square and hexagonal packing"
    ],
    "method": [
      "Rollers around a shaft of radius R: roller diameter = 2R sin(π/n) ÷ (1 − sin(π/n)); outside diameter = shaft + 2 × roller.",
      "Smallest circle around N equal circles of diameter d: d × k, with k = 1, 2, 2.1547, 2.4142, 2.7013, 3, 3, 3.3048, 3.6131, 3.8130 for N = 1…10 (proven optimal packings).",
      "Rectangle: square grid ⌊W/d⌋ × ⌊H/d⌋; hexagonal rows of alternating ⌊W/d⌋ and ⌊(W − d/2)/d⌋ at a pitch of 0.866d.",
      "Example: 8 rollers around a 40 mm shaft are 24.797 mm each."
    ],
    "limitations": [
      "Rollers around a shaft touch each other and the shaft (no clearance); add running clearance in practice.",
      "Rectangle counts use simple regular patterns; better irregular packings may exist.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Allow clearance between rollers and for cage bars when designing bearings."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 88–94. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "density-converter": {
    "purpose": "Convert density between kg/m³, g/cm³, kg/L, lb/in³, lb/ft³, lb/US gal and specific gravity (relative to water at 4 °C).",
    "uses": [
      "Convert material data between unit systems",
      "Turn specific gravity into density for mass calculations"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Buyers and estimators"
    ],
    "inputs": {
      "value": "The density or specific gravity as written on the data sheet.",
      "from": "Its unit."
    },
    "outputs": [
      "Density in each unit",
      "Specific gravity"
    ],
    "method": [
      "Factors to kg/m³: g/cm³ and kg/L × 1000; lb/in³ × 27 679.9047; lb/ft³ × 16.0184634; lb/US gal × 119.826427; specific gravity × 999.972 (water at 4 °C).",
      "Example: 7.85 g/cm³ = 7,850 kg/m³ = 0.283599 lb/in³."
    ],
    "limitations": [
      "Specific gravity is referenced to water at 4 °C; some data use 15.6 °C (60 °F) water, which differs slightly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the density at the working temperature for liquids."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 369–380, 2683. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "wind-chill": {
    "purpose": "Wind chill equivalent temperature from air temperature and wind speed (JAG/TI 2001 formula used in North America), for outdoor work planning.",
    "uses": [
      "Plan outdoor maintenance or construction work in cold wind",
      "Set cold-weather work rules",
      "Explain cold stress risk"
    ],
    "users": [
      "Safety officers",
      "Site supervisors",
      "Maintenance planners"
    ],
    "inputs": {
      "T": "Air temperature (the formula applies at 10 °C or below).",
      "V": "Wind speed measured at 10 m (weather station height)."
    },
    "outputs": [
      "Wind chill temperature",
      "Wind chill in °F"
    ],
    "method": [
      "WCT = 13.12 + 0.6215T − 11.37V^0.16 + 0.3965T V^0.16 (T in °C, V in km/h).",
      "Below about 4.8 km/h the wind chill equals the air temperature.",
      "Example: -5 °C with 30 km/h wind feels like -12.997 °C."
    ],
    "limitations": [
      "Valid for air temperatures of 10 °C or below and wind speeds above about 4.8 km/h.",
      "Sunshine, clothing and activity change actual cold stress.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Follow your organisation’s cold-stress guidance for work and rest periods."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2695–2697. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
