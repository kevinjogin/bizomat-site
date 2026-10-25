// MAKEOS methods, input sources and limits for the Machinery’s Handbook topic tools (batch handbook15).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "overhanging-beam": {
    "purpose": "Reactions, maximum positive and negative bending moments, stress and deflections of a beam on two supports with one or two overhangs, under end point loads or a uniform load.",
    "uses": [
      "Check platform, crane-runway and machine-bed beams with overhangs",
      "Choose support positions to balance moments",
      "Find tip deflection of an overhang"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "case": "Overhang arrangement and load type.",
      "L": "Distance between the two supports.",
      "a": "Length of each overhang beyond a support.",
      "load": "Point load at each overhang tip (N), or uniform load intensity w (N per metre run) for the uniform cases.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "I": "Second moment of area of the section about the bending axis.",
      "c": "Neutral axis to extreme fibre.",
      "allow": "Allowable bending stress from your design code."
    },
    "outputs": [
      "Reactions",
      "Maximum negative (support) and positive (span) moments",
      "Stress",
      "Tip and mid-span deflections"
    ],
    "method": [
      "One overhang, tip load P: R₂ = P(L + a)/L, R₁ = −Pa/L; M = −Pa at the support; tip δ = Pa²(L + a) ÷ 3EI.",
      "Two overhangs, tip loads P: R = P each; M = −Pa between supports; tip δ = Pa²(3L + 2a) ÷ 6EI; mid-span rises Pa L² ÷ 8EI.",
      "Equal overhangs, uniform w: R = w(L + 2a)/2; M_support = −wa²/2; M_centre = wL²/8 − wa²/2; δ_centre = wL²(5L² − 24a²) ÷ 384EI; tip δ = wa(3a³ + 6a²L − L³) ÷ 24EI.",
      "One overhang, uniform w: R₁ = w(L² − a²)/2L; M_support = −wa²/2; M_span max = R₁²/2w; tip δ = wa(4a²L − L³ + 3a³) ÷ 24EI.",
      "Example: the default beam has a support moment of -1.28 kN·m and a mid-span moment of 3.22 kN·m."
    ],
    "limitations": [
      "Linear elastic, constant section; self-weight is part of the uniform load only if included.",
      "Deflection signs: positive downward; negative values are upward.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Overhangs of about 0.35 × span with uniform load roughly balance support and span moments."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 257–262. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "two-span-beam": {
    "purpose": "Reactions, the support moment (three-moment equation), maximum span moments, stress and deflections of a beam continuous over two equal or unequal spans with uniform or point loads.",
    "uses": [
      "Check purlins, rails and shafts over three supports",
      "Find the centre support load",
      "Compare continuous and simply supported spans"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "case": "Uniform loads or one point load per span.",
      "L1": "Length of the first span.",
      "L2": "Length of the second span.",
      "w1": "Uniform load on span 1 in N per metre, or the point load in N.",
      "w2": "Uniform load on span 2, or its point load.",
      "a1": "Point load distance from the end support in span 1.",
      "a2": "Point load distance from the centre support in span 2.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "I": "Second moment of area of the section about the bending axis.",
      "c": "Neutral axis to extreme fibre.",
      "allow": "Allowable bending stress from your design code."
    },
    "outputs": [
      "End and centre reactions",
      "Centre support moment",
      "Maximum span moments and stress",
      "Maximum deflection in each span"
    ],
    "method": [
      "Three-moment equation with pinned ends: M_B = −(T₁ + T₂) ÷ 2(L₁ + L₂), with T = wL³/4 for a uniform load and P a(L² − a²)/L for a point load (a measured from the outer support).",
      "Reactions by statics: R_A = (simple-span reaction) + M_B ÷ L₁, similarly R_C; R_B = total load − R_A − R_C.",
      "Deflection of each span by superposition of the simple-span load and the end moment; maxima found by sampling.",
      "Example: two equal 3000 mm spans at 2000 N/m give a centre reaction of 7,500 N and a support moment of -2.25 kN·m."
    ],
    "limitations": [
      "Supports at the same level and rigid; constant section.",
      "Pattern loading (one span loaded) can govern; check it by setting one load to zero.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The centre support carries about 5/4 of a span’s uniform load for equal spans."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 264–267. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "beam-cases-more": {
    "purpose": "Reactions, maximum bending moment, stress and maximum deflection for a fixed–fixed beam with an off-centre load, beams fixed at one end and guided at the other, a propped cantilever with a point load anywhere, two symmetrical loads, and a uniform load on part of a span.",
    "uses": [
      "Check beams with built-in or guided ends",
      "Check a simply supported beam with two loads or a part-length load",
      "Fill gaps in standard beam tables"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "case": "Support and load arrangement.",
      "load": "Each point load, or the total of a uniform load.",
      "L": "Span between supports.",
      "a": "Load position as described for the case.",
      "cl": "Length of a part-span uniform load.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "I": "Second moment of area of the section about the bending axis.",
      "c": "Neutral axis to extreme fibre.",
      "allow": "Allowable bending stress from your design code."
    },
    "outputs": [
      "Reactions and maximum bending moment",
      "Bending stress",
      "Maximum deflection"
    ],
    "method": [
      "Fixed–fixed, load at a: M_A = −Pab²/L², M_B = −Pa²b/L², M_load = 2Pa²b²/L³; δ_load = Pa³b³ ÷ 3EIL³.",
      "Fixed–guided, end load: M = PL/2 at both ends, δ = PL³/12EI. Uniform: M = WL/3 fixed, WL/6 guided, δ = WL³/24EI.",
      "Propped, load at a from fixed end: R_B = Pa²(3L − a)/2L³; deflection from cantilever superposition.",
      "Two symmetrical loads: M = Pa, δ_centre = Pa(3L² − 4a²)/24EI. Part-span load: moment from statics, deflection by numerical integration of M/EI.",
      "Example: 5000 N at 600 mm on a fixed–fixed 2000 mm beam gives an end moment of 1.47 kN·m."
    ],
    "limitations": [
      "Linear elastic, constant section, small deflections.",
      "Fixed ends are assumed perfectly rigid; real connections rotate and reduce end moments.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the real end fixity is uncertain, check both the fixed and the simply supported cases."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 257–270. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "shaft-combined-stress": {
    "purpose": "Direct, bending and torsional stresses in a solid or hollow round shaft carrying axial load, bending moment and torque together, with principal stresses, von Mises and Tresca safety factors.",
    "uses": [
      "Check a shaft with thrust, bending and torque",
      "Check a bolt or rod in tension and torsion",
      "Check a propeller or screw shaft"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "d": "Outside diameter at the section.",
      "di": "Bore of a hollow shaft (0 if solid).",
      "P": "Axial force at the section.",
      "M": "Resultant bending moment at the section.",
      "T": "Torque at the section.",
      "Sy": "Minimum yield strength from the material certificate or specification.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Direct, bending and shear stresses",
      "Principal stresses",
      "von Mises and Tresca equivalent stresses and safety factors"
    ],
    "method": [
      "A = π(d² − dᵢ²)/4; Z = π(d⁴ − dᵢ⁴)/32d; Zp = 2Z.",
      "σ = P/A + M/Z (at the outer fibre where they add); τ = T/Zp.",
      "σ₁,₂ = σ/2 ± √((σ/2)² + τ²); von Mises √(σ² + 3τ²); Tresca √(σ² + 4τ²).",
      "Example: the default shaft has σ = 63.662 MPa, τ = 39.789 MPa and a von Mises stress of 93.82 MPa."
    ],
    "limitations": [
      "Static strength; stress concentrations and fatigue need separate checks (see the Goodman tool).",
      "Slender compressed shafts must also be checked for buckling.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Use von Mises for ductile shafts; Tresca is slightly more conservative."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218, 295–303. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "principal-stress-3d": {
    "purpose": "Principal stresses of a general three-dimensional stress state from its six components, by the stress invariants, with maximum shear, von Mises equivalent stress and the safety factor.",
    "uses": [
      "Post-process FEA or strain gauge results",
      "Check triaxial stress points in thick parts",
      "Teach and check stress transformation"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "sx": "Normal stress in X (tension positive).",
      "sy": "Normal stress in Y.",
      "sz": "Normal stress in Z.",
      "txy": "Shear stress in the XY plane.",
      "tyz": "Shear stress in the YZ plane.",
      "tzx": "Shear stress in the ZX plane.",
      "Sy": "Minimum yield strength from the material certificate or specification."
    },
    "outputs": [
      "Principal stresses σ1 ≥ σ2 ≥ σ3",
      "Maximum shear stress",
      "von Mises stress and safety factor"
    ],
    "method": [
      "Invariants I₁ = σx + σy + σz; I₂ = σxσy + σyσz + σzσx − τxy² − τyz² − τzx²; I₃ = det of the stress tensor.",
      "Principal stresses are the roots of σ³ − I₁σ² + I₂σ − I₃ = 0 (trigonometric solution).",
      "τmax = (σ₁ − σ₃)/2; von Mises = √(½[(σ₁ − σ₂)² + (σ₂ − σ₃)² + (σ₃ − σ₁)²]).",
      "Example: the default state has principal stresses 94.711, 21.367 and -46.078 MPa."
    ],
    "limitations": [
      "Static, isotropic material for the yield criteria.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Hydrostatic stress (equal principal stresses) does not cause yield in ductile metals."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 212–218. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "rankine-column": {
    "purpose": "Crippling load of a column by the Rankine–Gordon formula, which blends crushing and Euler buckling, with the theoretical or an empirical Rankine constant and the safety factor.",
    "uses": [
      "Check columns and struts of any slenderness with one formula",
      "Compare with Euler and Johnson results",
      "Use published Rankine constants for cast iron or timber"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "Sc": "Crushing or compressive yield strength of the material.",
      "E": "Elastic modulus from the material data sheet (steel is typically about 200 GPa).",
      "A": "Cross-section area.",
      "I": "Least second moment of area.",
      "L": "Unsupported length.",
      "K": "Effective length factor for the end conditions (1.0 pinned–pinned).",
      "aRank": "Empirical Rankine constant for pinned ends from your reference (e.g. about 1/7500 for mild steel); 0 uses the theoretical Sc ÷ π²E.",
      "P": "Applied compressive load.",
      "req": "Factor of safety required by your design code, customer specification or company standard."
    },
    "outputs": [
      "Slenderness ratio",
      "Rankine constant used",
      "Crippling load and safety factor"
    ],
    "method": [
      "r = √(I/A); slenderness λ = KL/r.",
      "P_cr = Sc A ÷ (1 + a λ²), with a = Sc ÷ π²E (theoretical) or an empirical value.",
      "Safety factor = P_cr ÷ P.",
      "Example: the default strut has λ = 100 and a Rankine load of 122.08 kN."
    ],
    "limitations": [
      "Empirical blend of crushing and buckling; codes (e.g. AS 4100) use other column curves.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Compare with the Euler and Johnson tool; the Rankine result lies below both limits."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 281–287. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "section-shapes-more": {
    "purpose": "Area, centroid, second moments of area, section moduli, radii of gyration and polar moment of elliptical, hollow elliptical, half-round, hexagonal, triangular, round-with-hexagon-hole, round-with-square-hole, Z and cross (X) sections.",
    "uses": [
      "Find properties of bars, extrusions and fabricated sections",
      "Check torsion and bending of hex and special bars",
      "Replace handbook section tables"
    ],
    "users": [
      "Design engineers",
      "Structural and mechanical engineers",
      "Engineering students"
    ],
    "inputs": {
      "shape": "Section type; the option text names each dimension.",
      "A": "First dimension as described.",
      "B": "Second dimension where needed.",
      "C": "Third dimension where needed.",
      "D": "Fourth dimension where needed."
    },
    "outputs": [
      "Area and centroid",
      "Ix and Iy about centroidal axes",
      "Section moduli and radii of gyration",
      "Polar moment where meaningful"
    ],
    "method": [
      "Ellipse: I = πab³/4 about the major axis (a, b semi-axes); hollow ellipse subtracts the inner ellipse.",
      "Half circle: centroid 4r/3π; Ix = (π/8 − 8/9π) r⁴. Hexagon (side s): I = 5√3 s⁴/16 about any centroidal axis. Triangle: Ix = bh³/36.",
      "Round with a hole: subtract the hole’s properties. Z and cross sections: sum of rectangles with the parallel axis theorem; principal moments for the Z.",
      "Example: a 30 mm across-flats hexagon has A = 779.42 mm² and I = 48,714 mm⁴."
    ],
    "limitations": [
      "Sharp corners; rolled and drawn sections have radii that change the properties slightly.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For torsion of non-circular sections, use the torsion tools rather than the polar moment."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 234–246. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "mass-inertia-more": {
    "purpose": "Mass moment of inertia and radius of gyration of a solid cone, hollow sphere, thin spherical shell, torus, ellipsoid, thin ring about a diameter and thin-walled cylinder, with a parallel-axis offset.",
    "uses": [
      "Size motors for rotating bodies of these shapes",
      "Find flywheel and rotor inertias",
      "Check CAD mass properties"
    ],
    "users": [
      "Automation engineers",
      "Design engineers"
    ],
    "inputs": {
      "shape": "Body and axis; the option text names the dimensions.",
      "mass": "Mass of the body.",
      "A": "First dimension as described.",
      "B": "Second dimension where needed.",
      "C": "Third dimension where needed (ellipsoid).",
      "offset": "Distance from the body’s own axis to the rotation axis (0 if it rotates about its own axis)."
    },
    "outputs": [
      "Moment of inertia about the body axis and the offset axis",
      "Radius of gyration"
    ],
    "method": [
      "Cone about axis 3mr²/10; about a base diameter m(3r²/20 + h²/10).",
      "Hollow sphere 2m(R⁵ − r⁵) ÷ 5(R³ − r³); thin shell 2mr²/3; torus m(R² + ¾r²) (R centre-line, r tube radius).",
      "Ellipsoid about axis a: m(b² + c²)/5 (semi-axes); thin ring about a diameter mr²/2; thin cylinder mr².",
      "Offset axis J = J₀ + m d².",
      "Example: a 10 kg torus of 400 mm centre-line diameter has J = 0.40675 kg·m²."
    ],
    "limitations": [
      "Uniform density and ideal shapes.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Combine with the reflected inertia tool to size a drive."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 228–240. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "force-system": {
    "purpose": "Resultant magnitude, direction, moment about the origin and line of action of up to four coplanar forces acting at different points, including parallel forces.",
    "uses": [
      "Find where the resultant of several loads acts on a beam or frame",
      "Find the centre of loads on a foundation",
      "Check equilibrium of a free body"
    ],
    "users": [
      "Design engineers",
      "Structural engineers",
      "Engineering students"
    ],
    "inputs": {
      "F1": "Magnitude of force 1 (0 if not used).",
      "a1": "Direction of force 1 anticlockwise from +X (−90° is straight down).",
      "x1": "X coordinate of any point on force 1’s line of action.",
      "y1": "Y coordinate of that point.",
      "F2": "Magnitude of force 2 (0 if not used).",
      "a2": "Direction of force 2 anticlockwise from +X (−90° is straight down).",
      "x2": "X coordinate of any point on force 2’s line of action.",
      "y2": "Y coordinate of that point.",
      "F3": "Magnitude of force 3 (0 if not used).",
      "a3": "Direction of force 3 anticlockwise from +X (−90° is straight down).",
      "x3": "X coordinate of any point on force 3’s line of action.",
      "y3": "Y coordinate of that point.",
      "F4": "Magnitude of force 4 (0 if not used).",
      "a4": "Direction of force 4 anticlockwise from +X (−90° is straight down).",
      "x4": "X coordinate of any point on force 4’s line of action.",
      "y4": "Y coordinate of that point."
    },
    "outputs": [
      "Resultant components and magnitude",
      "Moment about the origin",
      "Line of action of the resultant",
      "Couple when the resultant is zero"
    ],
    "method": [
      "Rx = Σ F cos θ; Ry = Σ F sin θ.",
      "Moment about the origin M = Σ (x Fy − y Fx).",
      "Line of action crosses the X axis at x₀ = M ÷ Ry (or the Y axis at −M ÷ Rx); if R = 0 the system reduces to a couple M.",
      "Example: the default downward loads total 3,000 N acting at x = 366.67 mm."
    ],
    "limitations": [
      "Coplanar forces only; 3D systems need a wrench reduction.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "For parallel loads, x₀ is the load centre: put a support or lifting point there to avoid tipping."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 153–163. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "square-wire-spring": {
    "purpose": "Rate, load at working length and torsional stress of a helical compression spring wound from square wire, using the handbook’s square-wire constants.",
    "uses": [
      "Check square-wire and die springs",
      "Compare square and round wire for the same space",
      "Specify a replacement spring"
    ],
    "users": [
      "Design engineers",
      "Spring buyers",
      "Toolmakers"
    ],
    "inputs": {
      "a": "Side of the square wire (radial and axial thickness).",
      "D": "Mean coil diameter.",
      "Na": "Active coils.",
      "G": "Shear modulus of the wire.",
      "L0": "Length with no load.",
      "Lw": "Installed or working length.",
      "allow": "Allowable shear stress for the material and duty."
    },
    "outputs": [
      "Spring rate",
      "Load at working length",
      "Corrected shear stress",
      "Spring index"
    ],
    "method": [
      "Deflection F = 5.58 P N D³ ÷ (G a⁴), so rate = G a⁴ ÷ (5.58 N D³) (round wire uses 8 and d⁴).",
      "Uncorrected stress S = P D ÷ (0.416 a³).",
      "Corrected stress uses the Wahl factor reduced by about 4% for square wire.",
      "Example: 3 mm square wire at 20 mm mean diameter gives k = 17.986 N/mm and 269.8 N at 45 mm."
    ],
    "limitations": [
      "Square wire keystones (deforms) during coiling; the formulas assume a square section in the coil.",
      "Solid length and buckling as for round-wire springs.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Square wire stores more energy than round wire in the same space but costs more."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 304–324. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "journal-bearing-petroff": {
    "purpose": "Unit load, Petroff friction torque, coefficient of friction and power loss of a hydrodynamic journal bearing, with the Sommerfeld number for use with design charts.",
    "uses": [
      "Estimate friction and heat in sleeve bearings",
      "Calculate the Sommerfeld number for Raimondi–Boyd charts",
      "Compare clearances and oils"
    ],
    "users": [
      "Design engineers",
      "Tribology and lubrication engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "d": "Journal (shaft) diameter.",
      "L": "Bearing length.",
      "c": "Radial clearance = (bore − journal) ÷ 2.",
      "mu": "Dynamic viscosity at the film temperature (centistokes × density in g/cm³ gives mPa·s; see the oil viscosity tool).",
      "rpm": "Shaft speed.",
      "W": "Radial load on the bearing."
    },
    "outputs": [
      "Unit load",
      "Petroff friction torque and coefficient",
      "Power loss",
      "Sommerfeld number"
    ],
    "method": [
      "Unit load P = W ÷ (d L).",
      "Petroff torque T = 4π² r³ L μ N ÷ c (N in rev/s); friction coefficient f = 2π² (μN/P)(r/c).",
      "Sommerfeld number S = (r/c)² μN ÷ P; power loss = 2πN T.",
      "Example: the default bearing has S = 0.12207, f = 0.0038553 and loses 75.699 W."
    ],
    "limitations": [
      "Petroff’s equation assumes a concentric journal (light load); at higher loads use the Sommerfeld number with design charts.",
      "Viscosity must be taken at the actual film temperature.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A larger Sommerfeld number means a thicker film; very small values risk boundary contact."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2326–2337. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "thrust-bearing-pads": {
    "purpose": "Pad area, unit load, mean sliding velocity and PV of a flat-land, tapered-land or tilting-pad thrust bearing (or a thrust washer), against allowable values.",
    "uses": [
      "Check a thrust washer or collar",
      "Screen a tilting-pad or tapered-land bearing size",
      "Compare pad geometries"
    ],
    "users": [
      "Design engineers",
      "Maintenance engineers"
    ],
    "inputs": {
      "Do": "Outer diameter of the pad ring.",
      "Di": "Inner diameter of the pad ring.",
      "fill": "Share of the ring area covered by pads (100% for a plain washer; 75–85% typical for pads with oil grooves).",
      "W": "Axial load.",
      "rpm": "Speed.",
      "Pallow": "Allowable unit load for the bearing type and material (hydrodynamic pads often 1.5–3.5 MPa; washers depend on material).",
      "PVallow": "PV limit for dry or boundary-lubricated washers; 0 to skip."
    },
    "outputs": [
      "Pad area and unit load",
      "Mean sliding velocity",
      "PV value"
    ],
    "method": [
      "Area = π(Do² − Di²)/4 × coverage.",
      "Unit load = W ÷ area.",
      "Mean velocity = π (Do + Di)/2 × n ÷ 60 000; PV = unit load × mean velocity.",
      "Example: 20000 N on a 150/80 mm ring at 80% coverage is 1.9771 MPa."
    ],
    "limitations": [
      "Screening by unit load and PV; hydrodynamic film thickness and temperature rise need the full design method.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the unit load is too high, increase the outside diameter or the number of pads."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 2338–2356. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "gas-compression-process": {
    "purpose": "Final volume and temperature and the work for isothermal, adiabatic or polytropic compression or expansion of a gas between two absolute pressures.",
    "uses": [
      "Estimate discharge temperature of a compressor",
      "Find work and volume for an air spring or accumulator",
      "Compare isothermal and adiabatic behaviour"
    ],
    "users": [
      "Process engineers",
      "Maintenance engineers",
      "Design engineers"
    ],
    "inputs": {
      "process": "How heat is exchanged during the process.",
      "p1": "Absolute starting pressure (1.013 bar at sea level for free air).",
      "V1": "Starting volume.",
      "T1": "Starting temperature.",
      "p2": "Absolute final pressure.",
      "k": "k = cp/cv (1.4 for air and nitrogen).",
      "n": "Polytropic exponent for the polytropic process (between 1 and k for cooled compressors)."
    },
    "outputs": [
      "Final volume",
      "Final temperature",
      "Work done on (or by) the gas"
    ],
    "method": [
      "p₁V₁ⁿ = p₂V₂ⁿ, with n = 1 (isothermal), k (adiabatic) or as entered.",
      "T₂ = T₁ (p₂/p₁)^((n − 1)/n) (kelvin).",
      "Work (closed system): isothermal p₁V₁ ln(p₂/p₁); otherwise (p₂V₂ − p₁V₁) ÷ (n − 1).",
      "Example: adiabatic compression of 100 L of air from 1.013 to 8 bar abs ends at 255.92 °C in 22.853 L."
    ],
    "limitations": [
      "Ideal gas; real compressors also have valve losses and leakage.",
      "Closed-system (non-flow) work; for steady-flow compressor work see the compressor power tool.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "High adiabatic temperatures show why compressors need intercooling and aftercooling."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 3032–3041. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
