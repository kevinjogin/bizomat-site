// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook21).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "prismoidal-volume": {
    "purpose": "Volume of any prismoid — prism, pyramid, frustum of a pyramid or cone, and approximately other tapering bodies — from the areas of the two ends and the middle section by the prismoidal formula, with helpers for rectangular and circular ends.",
    "uses": [
      "Find the volume of a hopper, chute or tapered tank",
      "Estimate the volume of a casting or forging blank between two sections",
      "Calculate cut-and-fill or stockpile volumes"
    ],
    "users": [
      "Design engineers",
      "Estimators",
      "Toolmakers"
    ],
    "inputs": {
      "mode": "How the sections are described.",
      "h": "Perpendicular distance between the two end sections.",
      "A1": "Area of one end.",
      "Am": "Area of the section halfway between the ends (measured, not averaged).",
      "A2": "Area of the other end.",
      "a1": "Length of the rectangular end 1.",
      "b1": "Width of end 1.",
      "a2": "Length of end 2.",
      "b2": "Width of end 2.",
      "D1": "Diameter of circular end 1.",
      "D2": "Diameter of circular end 2."
    },
    "outputs": [
      "Volume",
      "End and middle areas used",
      "Volume in litres"
    ],
    "method": [
      "V = h (A₁ + 4A_m + A₂) ÷ 6.",
      "For straight-sided bodies the middle section has the average linear dimensions of the ends; the formula is then exact for prisms, pyramids and frustums.",
      "Example: rectangular ends 600 × 400 and 300 × 200 mm, 500 mm apart, enclose 70 L."
    ],
    "limitations": [
      "Exact for bodies whose section area varies as a quadratic along the height; approximate for others.",
      "Ends must be parallel.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For irregular bodies, measure the middle section rather than averaging the ends."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "pappus-revolution": {
    "purpose": "Area of a surface of revolution (profile length × path of its centroid) and volume of a solid of revolution (profile area × path of its centroid) by the Pappus or Guldinus rules, for a torus or any profile with known centroid, over a full or partial revolution.",
    "uses": [
      "Find the volume of an O-ring, ring groove or turned bead",
      "Find the surface area of a turned part for coating or plating",
      "Estimate material in a rolled or spun ring"
    ],
    "users": [
      "Design engineers",
      "Estimators",
      "Toolmakers"
    ],
    "inputs": {
      "shape": "A circle swept into a torus, or any profile whose centroid you know.",
      "d": "Diameter of the circular cross-section.",
      "Dp": "Diameter of the circle traced by the cross-section’s centre.",
      "L": "Length of the profile line generating the surface.",
      "A": "Area of the profile generating the solid.",
      "rL": "Distance from the axis to the centroid of the line.",
      "rA": "Distance from the axis to the centroid of the area.",
      "ang": "Angle swept (360° for a full revolution)."
    },
    "outputs": [
      "Surface area of revolution",
      "Volume of revolution",
      "Centroid path length"
    ],
    "method": [
      "Surface area = length of the line × length of the path of its centre of gravity.",
      "Volume = area of the profile × length of the path of its centre of gravity.",
      "For a partial revolution the path is 2π r × angle ÷ 360°.",
      "Example: a 3 mm circle swept on a 10 mm path gives 296.09 mm² and 222.07 mm³ (the handbook’s torus example in inches gives 296.09 in² and 222.07 in³)."
    ],
    "limitations": [
      "The profile must lie wholly on one side of the axis and in a plane containing it.",
      "Centroid positions must be exact for exact results.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For an O-ring groove, compare the ring’s volume with the groove’s to check fill."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 66–67. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "simpson-area": {
    "purpose": "Area of a plane figure of irregular outline by Simpson’s rule from up to eleven equally spaced ordinates (heights), with the trapezoidal-rule result for comparison; also gives the volume when the ordinates are cross-section areas.",
    "uses": [
      "Find the area of a cam, template or casting outline from a drawing",
      "Find a volume from equally spaced cross-section areas",
      "Integrate a measured curve such as a pressure or force trace"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "W": "Equal width of each strip.",
      "Ns": "Number of strips; Simpson’s rule needs an even number.",
      "V0": "Height of the figure at strip boundary 0 (or the section area for a volume).",
      "V1": "Height of the figure at strip boundary 1 (or the section area for a volume).",
      "V2": "Height of the figure at strip boundary 2 (or the section area for a volume).",
      "V3": "Height of the figure at strip boundary 3 (or the section area for a volume).",
      "V4": "Height of the figure at strip boundary 4 (or the section area for a volume).",
      "V5": "Height of the figure at strip boundary 5 (or the section area for a volume).",
      "V6": "Height of the figure at strip boundary 6 (or the section area for a volume).",
      "V7": "Height of the figure at strip boundary 7 (or the section area for a volume).",
      "V8": "Height of the figure at strip boundary 8 (or the section area for a volume).",
      "V9": "Height of the figure at strip boundary 9 (or the section area for a volume).",
      "V10": "Height of the figure at strip boundary 10 (or the section area for a volume)."
    },
    "outputs": [
      "Area by Simpson’s rule",
      "Area by the trapezoidal rule",
      "Difference between the two"
    ],
    "method": [
      "A = (W ÷ 3) [(V₀ + V_N) + 4 (V₁ + V₃ + … + V_N−1) + 2 (V₂ + V₄ + … + V_N−2)].",
      "Trapezoidal check: A = W [(V₀ + V_N) ÷ 2 + V₁ + … + V_N−1].",
      "Entering section areas in place of heights gives a volume.",
      "Example: eight strips 10 mm wide give an area of 1,266.7 mm²."
    ],
    "limitations": [
      "Exact for curves up to the third degree between ordinates; accuracy improves with more strips.",
      "Strips must be of equal width.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A large difference from the trapezoidal result means more strips are needed."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 67–68. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "spherical-triangle": {
    "purpose": "Oblique spherical triangle solved from its three sides (as arc angles): the three spherical angles by the law of cosines, spherical excess and surface area; or the great-circle distance and initial bearing between two latitude and longitude points on a sphere.",
    "uses": [
      "Lay out panels on a dome or spherical tank",
      "Find the distance between two sites on the earth",
      "Check spherical geometry for optics or radomes"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "mode": "Solve a triangle, or measure between two points.",
      "R": "Radius of the sphere (6,371 km for the earth, in the same length unit you want back).",
      "a": "Side a as the angle it subtends at the centre.",
      "b": "Side b as an angle.",
      "c": "Side c as an angle.",
      "lat1": "Latitude of point 1 (south negative).",
      "lon1": "Longitude of point 1 (west negative).",
      "lat2": "Latitude of point 2.",
      "lon2": "Longitude of point 2."
    },
    "outputs": [
      "Spherical angles",
      "Spherical excess and area",
      "Great-circle distance and bearing"
    ],
    "method": [
      "Law of cosines: cos A = (cos a − cos b cos c) ÷ (sin b sin c), and likewise for B and C.",
      "Area = R² × (A + B + C − 180°) in radians — the handbook’s Area = R² π ÷ 180 × spherical excess.",
      "Great circle: central angle by the haversine formula; distance = R × angle; initial bearing from the spherical sine and cosine rules.",
      "Example: sides of 90°, 90° and 120° on a 10 mm sphere enclose 209.44 mm² (one sixth of the sphere, as in the handbook)."
    ],
    "limitations": [
      "Perfect sphere; the earth is slightly flattened (distances within about 0.5%).",
      "Sides must satisfy the spherical triangle inequalities and sum to less than 360°.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Arc length of each side = R × side angle in radians."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 115–118. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "progression": {
    "purpose": "Last term and sum of an arithmetical progression (constant difference) or a geometrical progression (constant ratio) from the first term, the difference or ratio and the number of terms, with the ratio or difference that fits a given first and last term.",
    "uses": [
      "Space a set of sizes or speeds between two limits",
      "Sum stepped quantities such as escalating costs",
      "Work out the ratio between steps of a series"
    ],
    "users": [
      "Engineers",
      "Technicians",
      "Engineering students"
    ],
    "inputs": {
      "type": "Choose the kind of progression.",
      "a": "The first term.",
      "d": "Difference between successive terms.",
      "r": "Ratio of each term to the one before.",
      "n": "Number of terms.",
      "l": "Optional last term: the difference or ratio that reaches it in n terms is also reported."
    },
    "outputs": [
      "Last term",
      "Sum of all terms",
      "Difference or ratio that fits a given last term"
    ],
    "method": [
      "Arithmetical: l = a + (n − 1) d; S = n (a + l) ÷ 2.",
      "Geometrical: l = a rⁿ⁻¹; S = a (rⁿ − 1) ÷ (r − 1), or n a when r = 1.",
      "Fit: d = (l − a) ÷ (n − 1); r = (l ÷ a)^(1/(n−1)).",
      "Example: 8 terms from 2 with ratio 1.5 end at 34.172 and sum to 98.516."
    ],
    "limitations": [
      "Fitting a geometrical ratio needs first and last terms of the same sign.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Machine speeds and sizes usually follow a geometrical progression; costs that rise by a fixed amount follow an arithmetical one."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 37–39. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "preferred-numbers": {
    "purpose": "Theoretical values of the Renard preferred number series R5, R10, R20, R40 and R80 (the n-th roots of ten) lying between two limits, with the step ratio and the values rounded to three significant figures, for choosing standard sizes, capacities and speeds.",
    "uses": [
      "Choose a rational range of sizes or ratings for a product family",
      "Pick standard capacities, speeds or pressures",
      "Check that a size range steps evenly"
    ],
    "users": [
      "Product engineers",
      "Design engineers",
      "Standards engineers"
    ],
    "inputs": {
      "series": "Renard series: n values per factor of ten.",
      "min": "Smallest size of interest.",
      "max": "Largest size of interest."
    },
    "outputs": [
      "Values in the range",
      "Step ratio",
      "Count of values"
    ],
    "method": [
      "Theoretical values are 10^(i ÷ n) times a power of ten, for the series Rn.",
      "The step ratio between neighbours is 10^(1/n).",
      "Standard (ISO 3) rounded values differ slightly from simple rounding at a few steps; use the standard list for final designations.",
      "Example: R10 between 1 and 10 gives 11 values."
    ],
    "limitations": [
      "At most 200 values are listed.",
      "Rounded values shown are to three significant figures, not the standard’s rounded designations.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Coarser series (R5) keep a product range small; finer series (R40) fit closer to demand."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 672. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "line-intersection": {
    "purpose": "Analytical geometry of straight lines each defined by two points: slopes and intercepts, the intersection point, the angle between the lines, and the perpendicular distance and foot of the perpendicular from a point to the first line.",
    "uses": [
      "Find a theoretical sharp corner from two drawn edges",
      "Check a CNC contour intersection",
      "Measure the distance of a hole from an inclined edge"
    ],
    "users": [
      "CNC programmers",
      "Toolmakers",
      "Design engineers"
    ],
    "inputs": {
      "x1": "First point on line 1.",
      "y1": "First point on line 1.",
      "x2": "Second point on line 1.",
      "y2": "Second point on line 1.",
      "x3": "First point on line 2.",
      "y3": "First point on line 2.",
      "x4": "Second point on line 2.",
      "y4": "Second point on line 2.",
      "px": "Point whose distance from line 1 is wanted.",
      "py": "Point whose distance from line 1 is wanted."
    },
    "outputs": [
      "Intersection point",
      "Angle between the lines",
      "Distance from the point to line 1"
    ],
    "method": [
      "Each line in the form A x + B y = C from its two points; the intersection solves both (none when parallel).",
      "Angle between lines from their direction vectors.",
      "Distance from a point = |A x₀ + B y₀ − C| ÷ √(A² + B²).",
      "Example: the lines cross at (53.333, 26.667) at 71.565°."
    ],
    "limitations": [
      "Plane geometry; each line needs two distinct points.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use the foot of the perpendicular as the gauging point when inspecting an edge position."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 40–46. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "drop-hammer-blow": {
    "purpose": "Average force of a blow from a falling weight — a drop hammer, pile driver or drop-test mass — by equating the work of the fall (including the penetration) with force × penetration, with impact speed, energy and an efficiency for losses.",
    "uses": [
      "Estimate the force delivered by a drop hammer or press",
      "Size a stop or anvil for a drop test",
      "Check pile driving resistance from set per blow"
    ],
    "users": [
      "Forging supervisors",
      "Test engineers",
      "Civil and site engineers"
    ],
    "inputs": {
      "m": "Mass of the ram, hammer or drop weight.",
      "h": "Height of the drop to first contact.",
      "d": "Distance the work moves (deforms or is driven) during the blow.",
      "eff": "Fraction of the energy that does useful work; the handbook formula neglects losses (100%)."
    },
    "outputs": [
      "Average force of the blow",
      "Impact speed and energy",
      "Force in weight terms"
    ],
    "method": [
      "Work of fall = W S, with S the total height including the penetration d.",
      "Average force × d = W S, so F = η m g (h + d) ÷ d.",
      "Impact speed = √(2 g h).",
      "Example: 500 kg falling 1.5 m with a 10 mm set delivers about 740.4 kN."
    ],
    "limitations": [
      "Average force only; peak force is higher and depends on stiffness.",
      "Losses from rebound, heat and elastic strain reduce the useful force.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the penetration doubles the average force: hard stops see very high forces."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 183–184. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "mixture-cost": {
    "purpose": "Rule of mixtures (alligation): cost or any additive property per unit of a mixture of up to four ingredients by weighted average, and the proportions of two ingredients that blend to a target value (alligation alternate), with the quantities for a batch.",
    "uses": [
      "Cost an alloy or compound from its ingredients",
      "Blend two coolants, oils or powders to a target concentration",
      "Mix two grades to a target property or price"
    ],
    "users": [
      "Process engineers",
      "Buyers",
      "Foundry and mixing supervisors"
    ],
    "inputs": {
      "mode": "Average a mixture, or find blend proportions.",
      "q1": "Quantity of ingredient 1 (any consistent unit).",
      "p1": "Its price per unit or its value of an additive property (for example a concentration).",
      "q2": "Quantity of ingredient 2.",
      "p2": "Its value.",
      "q3": "Quantity of ingredient 3.",
      "p3": "Its value.",
      "q4": "Quantity of ingredient 4.",
      "p4": "Its value.",
      "vA": "Value of the first blend ingredient (for example concentration %).",
      "vB": "Value of the second blend ingredient.",
      "vT": "Value wanted in the blend; must lie between the two.",
      "batch": "Total quantity to make."
    },
    "outputs": [
      "Value of the mixture per unit",
      "Blend proportions",
      "Quantities for the batch"
    ],
    "method": [
      "Mixture: value per unit = Σ (quantity × value) ÷ Σ quantity (handbook alloy example: $150.80 ÷ 85 lb ≈ $1.77 per lb).",
      "Blend: share of A = (v_B − v_T) ÷ (v_B − v_A); share of B = 1 − share of A.",
      "Example: the four ingredients average 1.7741 per unit."
    ],
    "limitations": [
      "Valid only for properties that mix linearly by quantity (cost, mass concentration); not for viscosity, strength or hardness.",
      "Process losses and mixing costs are not included.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For coolants and solutions, blend by mass or volume consistently with how the concentration is defined."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 384. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "column-safe-stress-classic": {
    "purpose": "Safe unit stress for steel compression members by the classic AISC working-stress formulas quoted in the handbook — parabolic up to l/r 120, and the secant-type formula above 120 for bracing and secondary members, reduced for main members — with the safe concentric load for a given section area.",
    "uses": [
      "Check an existing or historic steel strut or column",
      "Compare older design calculations with current methods",
      "Quick sizing of light bracing"
    ],
    "users": [
      "Structural engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "L": "Effective (unbraced) length of the member.",
      "r": "Least radius of gyration of the section.",
      "A": "Gross area of the section.",
      "member": "Main members above l/r 120 take a further reduction.",
      "P": "Axial load to check."
    },
    "outputs": [
      "Slenderness ratio",
      "Safe unit stress",
      "Safe concentric load"
    ],
    "method": [
      "l/r ≤ 120: safe stress = 17,000 − 0.485 (l/r)² psi.",
      "l/r > 120, bracing and secondary members: 18,000 ÷ [1 + (l/r)² ÷ 18,000] psi; main members: that value × (1.6 − l/r ÷ 200).",
      "Converted to MPa (1 psi = 0.0068948 MPa); safe load = stress × area.",
      "Example: l/r = 100 gives a safe stress of 83.772 MPa."
    ],
    "limitations": [
      "Historic working-stress formulas for mild structural steel; current design uses AISC 360 or the local steel code.",
      "Concentric loads only; main members are limited to l/r 200 here.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use for comparison and older structures; confirm new work to the current code."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–285. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
