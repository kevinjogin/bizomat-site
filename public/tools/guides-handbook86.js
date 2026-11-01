// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook86).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "sphere-sections": {
    "purpose": "Areas and volumes of a sphere and of the spherical sections drawn in the handbook: the whole sphere (or its radius from a volume), the wall G between two concentric spheres, the sector K of included angle φ, the segment S of base diameter E and height F, the zone T between parallel planes of diameters P and Q a height H apart (with the radius of its sphere), the hollow sector U between two spheres, the solid ring W (torus) and the part Z of a ring within an angle φ, with the mass from a density you enter.",
    "uses": [
      "Find the volume and mass of a dished head, cap or domed part",
      "Find the radius of the sphere a zone or cap was cut from",
      "Work out the material in a hollow ball, ring or part ring"
    ],
    "users": [
      "Designers and drafters",
      "Estimators",
      "Fabricators",
      "Students"
    ],
    "inputs": {
      "sec": "Which spherical section to calculate, as lettered in the handbook figure; the fields each section uses are named in brackets.",
      "R": "Radius of the sphere for the whole sphere and the sector K.",
      "Nv": "Volume of a whole sphere when you want the radius it needs.",
      "R1": "Outer sphere radius for the wall G and hollow sector U; for the ring W and part ring Z, the radius from the ring axis to the centre of the ring section.",
      "R2": "Inner sphere radius for the wall G and hollow sector U; for the ring W and part ring Z, the radius of the circular ring section.",
      "phi": "Included angle of the sector K or hollow sector U at the centre of the sphere, or the angle of the part ring Z about the ring axis.",
      "E": "Diameter of the flat base of the segment (cap).",
      "F": "Height of the segment from its base to the top of the sphere.",
      "H": "Distance between the two parallel planes that bound the zone.",
      "P": "Diameter of the circle where one plane cuts the sphere.",
      "Q": "Diameter of the circle where the other plane cuts the sphere.",
      "rho": "Density of the material the section is made of, from your material data."
    },
    "outputs": [
      "Surface area of the section",
      "Volume of the section",
      "Mass at the density entered",
      "Radius of the sphere (from a volume, segment or zone)",
      "Depth F of a sector from its angle"
    ],
    "method": [
      "Sphere: area 4πR², volume (4/3)πR³; radius from volume R = ∛(3V ÷ 4π).",
      "Wall G: area 4πR₁² + 4πR₂², volume (4/3)π(R₁³ − R₂³).",
      "Sector K: area of the spherical surface 2πR²(1 − cos ½φ), depth F = R(1 − cos ½φ), volume 2πR²F ÷ 3.",
      "Segment S: area π(F² + E²/4), volume πF(E²/8 + F²/6); sphere radius (E²/4 + F²) ÷ 2F.",
      "Zone T: sphere radius √(((P² − Q² − 4H²) ÷ 8H)² + P²/4), area 2πRH, volume H(π/6)(H² + 3Q²/4 + 3P²/4).",
      "Hollow sector U: area 2π(R₁² + R₂²)(1 − cos ½φ), volume (2π/3)(R₁³ − R₂³)(1 − cos ½φ), the sector K of R₁ less that of R₂.",
      "Ring W: area 4π²R₁R₂, volume 2π²R₁R₂²; part ring Z: those values × φ ÷ 360.",
      "Example: a segment 200 mm across its base and 50 mm high has a volume of 850,850 mm³ and is cut from a sphere of radius 125 mm."
    ],
    "limitations": [
      "Areas are of the curved spherical or ring surfaces the handbook lists; flat ends and the conical faces of sectors are not included.",
      "The hollow sector volume uses (2π/3), consistent with the sector K formula; the handbook table prints 2π, which overstates the volume three times.",
      "Mass uses the density you enter and the volume of a solid section.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A segment higher than the radius of its sphere is more than a hemisphere; the same formulas hold.",
      "For a zone, the two planes can be on the same side of the centre or on opposite sides; the radius formula covers both."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 52–54. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "conic-section-equation": {
    "purpose": "Identifies the conic section of a general second-degree equation without an xy term and puts it into the standard form by completing the squares, as in the handbook examples: for a parabola (y − k)² = 4p(x − h) or (x − h)² = 4p(y − k), giving vertex, focus, directrix, axis and latus rectum; for an ellipse or circle the centre, semi-axes, foci and eccentricity; for a hyperbola (x − h)²/a² − (y − k)²/b² = 1 (or the vertical form) the centre, a, b, c = √(a² + b²), the eccentricity e = c ÷ a, vertices, foci and asymptotes.",
    "uses": [
      "Find the focus of a parabolic reflector or profile from its equation",
      "Check a curve equation from a drawing or CAD export",
      "Work the conic examples in a maths course"
    ],
    "users": [
      "Students",
      "Designers",
      "CNC programmers"
    ],
    "inputs": {
      "A": "Number multiplying x² in the equation Ax² + Cy² + Dx + Ey + F = 0 (enter 0 when there is no x² term).",
      "C": "Number multiplying y² in the equation (enter 0 when there is no y² term).",
      "D": "Number multiplying x in the equation, with its sign.",
      "E": "Number multiplying y in the equation, with its sign.",
      "F": "Constant term of the equation, with its sign."
    },
    "outputs": [
      "Kind of curve",
      "Vertex or centre (h, k)",
      "Parabola: p, focus, directrix, latus rectum",
      "Ellipse or hyperbola: a, b, c and eccentricity",
      "Vertices, foci and asymptotes"
    ],
    "method": [
      "Parabola (A or C zero): complete the square in the squared variable to reach (y − k)² = 4p(x − h) or (x − h)² = 4p(y − k); focus at p from the vertex along the axis, directrix at −p, latus rectum through the focus with length |4p|.",
      "Otherwise A(x − h)² + C(y − k)² = G with h = −D ÷ 2A, k = −E ÷ 2C and G = D²/4A + E²/4C − F.",
      "AC > 0: ellipse with semi-axes √(G ÷ A) along x and √(G ÷ C) along y (a circle when they are equal); c = √(a² − b²) along the major axis, e = c ÷ a.",
      "AC < 0: hyperbola; its transverse axis is along x when G ÷ A > 0; c² = a² + b², e = c ÷ a, asymptotes through the centre with slopes ± b ÷ a (x axis) or ± a ÷ b (y axis).",
      "Example: 9x² + (-4)y² + (-36)x + 8y + (-4) = 0 is a hyperbola with vertex or centre (2, 1) and eccentricity 1.8028."
    ],
    "limitations": [
      "Equations with an xy term (rotated conics) are not covered.",
      "Equations that reduce to a point, a pair of lines or no real curve are reported as such.",
      "The handbook text says a hyperbola’s eccentricity is always less than 1; it is always greater than 1, as its own example (e = √13 ÷ 2) shows.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Eccentricity 0 is a circle, between 0 and 1 an ellipse, 1 a parabola and above 1 a hyperbola.",
      "Multiplying the whole equation by a number does not change the curve."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 54–55. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "four-arc-oval": {
    "purpose": "Four-arc oval construction from the handbook (Brueckner method), which still works when the length is four or more times the width: end radius r = (B² ÷ 2A)(A ÷ B)^0.38, the distance X of the side-arc centre beyond the oval centre X = (A²/4 − Ar + Br − B²/4) ÷ (B − 2r) and the side radius R = B/2 + X, with the arc centres for layout, the angle of each arc, the tangent points, and the perimeter and area of the oval against the true ellipse. A smaller or larger end radius can be entered to make the oval thinner or fatter.",
    "uses": [
      "Lay out an oval flange, duct, tank or opening with compasses or arcs in CAD",
      "Program an oval as four arcs on a CNC machine",
      "Compare an arc oval with the true ellipse area"
    ],
    "users": [
      "Sheet metal workers",
      "Drafters",
      "CNC programmers",
      "Pattern makers"
    ],
    "inputs": {
      "A": "Overall length of the oval along its major axis.",
      "B": "Overall width of the oval across its minor axis.",
      "rFrom": "Use the handbook’s equation (1) for the end radius, or enter your own radius: smaller makes the oval thinner at the ends, larger makes it fatter.",
      "rg": "End radius used when you choose to enter it; it must be less than half the width."
    },
    "outputs": [
      "End radius r and side radius R",
      "Distance of the side-arc centres from the oval centre",
      "Centres of the four arcs for layout",
      "Angle of each arc and the tangent points",
      "Perimeter and area of the oval and the ellipse area"
    ],
    "method": [
      "r = (B² ÷ 2A)(A ÷ B)^0.38 (handbook equation 1), or the radius you enter.",
      "X = (A²/4 − Ar + Br − B²/4) ÷ (B − 2r) (equation 2); R = B/2 + X (equation 3).",
      "End-arc centres lie on the major axis at ±(A/2 − r) from the oval centre; side-arc centres lie on the minor axis at X beyond the centre, on the side away from the arc they draw.",
      "The arcs meet on the line joining their centres, at a half-angle α = atan((A/2 − r) ÷ X) from the minor axis; each side arc spans 2α and each end arc 180° − 2α.",
      "Perimeter 4αR + 2(π − 2α)r; area 2R²α + r²(π − 2α) − 2(A/2 − r)X; ellipse area πAB ÷ 4.",
      "Example: a 400 × 100 mm oval uses end arcs of radius 21.169 mm and side arcs of radius 590.2 mm with centres 540.2 mm beyond the oval centre."
    ],
    "limitations": [
      "The oval is made of circular arcs that meet tangentially; it is close to, but not exactly, an ellipse.",
      "The major axis must be longer than the minor axis, and the end radius less than half the width.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The area difference from the true ellipse shows how close the approximation is; a larger end radius makes the oval fuller at the ends and a smaller one makes it thinner."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 51. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "hole-location-disks": {
    "purpose": "Disk method of locating holes in small precision work, by the handbook rule: three carefully centred disks are made to such diameters that when their rims touch, each disk centre lies on a hole position; the disks are then clamped to the work and each in turn is indicated true with the lathe spindle. From the centre distances A–B, B–C and A–C the radii are r_A = (AB − BC + AC) ÷ 2, r_B = AB − r_A and r_C = BC − r_B, with the triangle of the hole positions for checking the layout.",
    "uses": [
      "Make locating disks for three holes bored on the lathe",
      "Check the layout of three holes from their centre distances",
      "Plan a toolroom job without a jig borer"
    ],
    "users": [
      "Toolmakers",
      "Toolroom machinists",
      "Model engineers"
    ],
    "inputs": {
      "x": "Distance between the centres of holes A and B from the drawing (dimension x in the handbook).",
      "y": "Distance between the centres of holes B and C (dimension y).",
      "z": "Distance between the centres of holes A and C (dimension z)."
    },
    "outputs": [
      "Diameter of each disk",
      "Radius of each disk",
      "Angles of the hole triangle",
      "Position of hole C with A at the origin and B on the x axis"
    ],
    "method": [
      "x − y is the difference between the radii of disks A and C; adding z gives the diameter of disk A, so r_A = (x − y + z) ÷ 2.",
      "r_B = x − r_A; r_C = y − r_B; check r_A + r_C = z.",
      "Angles of the triangle by the law of cosines; hole C at ((x² + z² − y²) ÷ 2x, √(z² − that²)) from hole A with B on the x axis.",
      "Example: centre distances 23.622, 18.288 and 21.844 mm need disks of 27.178, 20.066 and 16.51 mm diameter."
    ],
    "limitations": [
      "Each disk must have a positive radius, which needs each centre distance to be less than the sum of the other two.",
      "The accuracy of the hole positions depends on the disk diameters, their roundness and the centring of their holes; grind and measure them.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A very small disk means one hole is close to the line through the other two; consider locating that hole from a different pair."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3481–3482. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "metal-ball-lot-check": {
    "purpose": "Lot check and package marking for standard metal balls in the terms of ANSI/AFBMA Std 10 as described in the handbook: the lot mean diameter DwmL from the mean diameters of the largest and smallest balls, the lot diameter variation VDwL, the size the order asks for (nominal diameter plus the ball gauge), acceptance between the limits you enter for the grade, the specific diameter (lot mean diameter rounded to the container marking increment, less the nominal diameter) for the package label, and the number of balls per kilogram and the lot mass from the material density.",
    "uses": [
      "Accept or reject a delivered lot of bearing or valve balls",
      "Work out the specific diameter for a package label",
      "Estimate how many balls a weighed quantity contains"
    ],
    "users": [
      "Quality inspectors",
      "Bearing and valve assemblers",
      "Purchasing and stores"
    ],
    "inputs": {
      "Dw": "Nominal diameter used to identify the ball size, for example 6 mm or 1/4 in (6.35 mm).",
      "gage": "Ball gauge on the order: the small signed amount by which the lot mean diameter should differ from the nominal diameter (0 is “OK”).",
      "devMinus": "How far the lot mean diameter may fall below the ordered size (nominal plus ball gauge) for the grade, from the standard or your agreement with the maker.",
      "devPlus": "How far the lot mean diameter may lie above the ordered size for the grade.",
      "inc": "Container marking increment for the grade from the standard’s Table 1, the step to which the specific diameter is rounded.",
      "VLmax": "Allowed lot diameter variation for the grade from the standard’s Table 1.",
      "Dmax": "Mean diameter (average of largest and smallest single diameters) of the largest ball found in the lot.",
      "Dmin": "Mean diameter of the smallest ball found in the lot.",
      "rho": "Density of the ball material from your material data; the handbook lists, for example, 7833 kg/m³ for chrome alloy steel.",
      "qty": "Number of balls in the lot or package, for the lot mass."
    },
    "outputs": [
      "Lot mean diameter and lot diameter variation",
      "Ordered size and acceptance limits",
      "Ball gauge deviation",
      "Specific diameter to mark on the package",
      "Balls per kilogram and lot mass"
    ],
    "method": [
      "DwmL = (mean diameter of the largest ball + mean diameter of the smallest ball) ÷ 2; VDwL = their difference.",
      "Ordered size = Dw + ball gauge; the lot is accepted when DwmL lies within the limits entered and VDwL does not exceed the allowed variation.",
      "Ball gauge deviation S = DwmL − (Dw + ball gauge).",
      "Specific diameter = DwmL rounded to the container marking increment − Dw.",
      "Balls per kilogram = 1 ÷ (π/6 Dw³ ρ), which is the handbook’s 1,910,000 ÷ (Dw³ ρ) with Dw in mm and ρ in g/cm³.",
      "Example: 6 mm balls ordered at -4 µm ball gauge measuring 5.9963 mm lot mean are marked with a specific diameter of -3.75 µm; there are about 1,128.8 balls per kilogram."
    ],
    "limitations": [
      "Grade tolerances, marking increments and ball gauges come from ANSI/AFBMA Std 10 (or ISO 3290) and the order; enter them, they are not built in.",
      "The check covers the lot size; individual ball diameter variation, form, roughness and hardness are checked separately.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A lot outside its limits may still suit another ball gauge; the specific diameter shows where it falls.",
      "Rounding is to the nearest marking increment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3355–3357, 3361–3362. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "engine-flywheel-rim-and-arms": {
    "purpose": "Flywheel rim weight for engines by the handbook formulas W = 387,587,500 c n HP ÷ (D² N³) when the indicated horsepower is given and W = 11,745 n E ÷ (D² N²) when the work per revolution is given, here in SI as rim mass m = n E ÷ v² with E = c × work per revolution, the factor of energy excess c entered from the table for the engine and cut-off, 1/n the allowed speed variation and v the speed of the mean rim diameter; with the rim cross-section for the material density, and the arm proportions: width at the hub 1.3 × shaft diameter for six arms or 1.2 × for eight, thickness half the width, and the area at the rim at least two-thirds of the area at the hub.",
    "uses": [
      "Size the rim of an engine or compressor flywheel",
      "Check an existing flywheel against a tighter speed variation",
      "Proportion cast flywheel arms for the shaft"
    ],
    "users": [
      "Machine designers",
      "Engine and compressor restorers",
      "Mechanical engineering students"
    ],
    "inputs": {
      "given": "Find the work per revolution from the indicated power and speed, or enter the work per revolution directly (piston force × twice the stroke for a double-acting engine).",
      "P": "Indicated power of the engine, used when energy is found from power.",
      "Wrev": "Average work done by the engine in one revolution, used when entered directly.",
      "c": "Factor of energy excess for the engine type and point of cut-off, from the handbook table or engine data; the rim must absorb this share of the work per revolution.",
      "N": "Rotational speed of the flywheel.",
      "pct": "Allowed variation in speed as a percentage of the mean speed (1/n; the handbook gives 1/50 to 1/100, that is 2 % to 1 %).",
      "Dm": "Mean diameter of the rim, to the centre of the rim section.",
      "rho": "Density of the rim material from your material data (for the rim cross-section).",
      "arms": "Number of arms (spokes) in the wheel; the handbook gives proportions for six and eight.",
      "ds": "Diameter of the shaft at the hub, which sets the arm proportions."
    },
    "outputs": [
      "Rim mass (and in pounds)",
      "Energy excess E the rim absorbs",
      "Rim speed at the mean diameter",
      "Rim cross-section area",
      "Arm width and thickness at the hub",
      "Arm section area at the hub and the least area at the rim"
    ],
    "method": [
      "Work per revolution = power × 60 ÷ N (or entered); E = c × work per revolution.",
      "Rim mass m = n E ÷ v² with v = π D N ÷ 60 and n = 100 ÷ allowed variation in per cent; this is the handbook’s W = 11,745 n E ÷ (D² N²) (and 387,587,500 c n HP ÷ (D² N³)) in consistent units.",
      "Rim cross-section = m ÷ (ρ π D).",
      "Arm width at the hub W = 1.3 × shaft diameter (6 arms) or 1.2 × (8 arms); thickness = W ÷ 2; elliptical area π W t ÷ 4; area at the rim at least two-thirds of that.",
      "Example: 112 kW at 200 rpm with c = 0.209 and 2 % variation needs a rim of about 988.22 kg on a 1.8 m mean diameter."
    ],
    "limitations": [
      "The rim is taken to store all the energy; arms and hub add a little, which the handbook formulas neglect.",
      "The factor of energy excess depends on the engine type, cut-off, reciprocating masses and connecting rod; enter it from the table or engine data.",
      "Check the rim stress and bursting speed for the material (flywheel-rim-design) before use.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the allowed speed variation doubles the rim mass; doubling the mean diameter at the same speed cuts it to a quarter.",
      "Arms should be about three-quarters as strong as the shaft in torsion and taper towards the rim."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3010–3011. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
